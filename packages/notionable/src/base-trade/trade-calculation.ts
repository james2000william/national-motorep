import {
  BaseLiquidityPool,
  VaultAdapter,
  AccountDefinition,
  TokenDefinition,
  TokenBalance,
  fCashMarket,
  Registry,
} from '@notional-finance/core-entities';
import { RiskFactorLimit, RiskFactorKeys } from '@notional-finance/risk-engine';
import {
  CalculationFn,
  CalculationFnParams,
} from '@notional-finance/transaction';
import { filterEmpty, RATE_PRECISION } from '@notional-finance/util';
import {
  Observable,
  combineLatest,
  filter,
  bufferCount,
  auditTime,
  map,
} from 'rxjs';
import { isHashable } from '../utils';
import {
  BaseTradeState,
  TokenOption,
  TradeType,
  VaultTradeType,
  isVaultTrade,
} from './base-trade-store';
import { getTradeConfig } from './logic';

export function calculate(
  state$: Observable<BaseTradeState>,
  debtPool$: Observable<BaseLiquidityPool<unknown> | undefined>,
  collateralPool$: Observable<BaseLiquidityPool<unknown> | undefined>,
  vaultAdapter$: Observable<VaultAdapter | undefined>,
  account$: Observable<AccountDefinition | null>
) {
  return combineLatest([
    state$,
    debtPool$,
    collateralPool$,
    account$,
    vaultAdapter$,
  ]).pipe(
    filter(([s]) => s.isReady && !!s.tradeType),
    // NOTE: use a bufferCount(2, 1) here instead of pairwise to ensure that
    // we don't get race conditions around duplicate input keys. The second
    // parameter ensures that we start a new buffer on every emission
    bufferCount(2, 1),
    // Add this here to throttle calculations for the UI a bit.
    auditTime(100),
    map(([[p], [s, debtPool, collateralPool, a, vaultAdapter]]) => ({
      prevCalculateInputKeys: p.calculateInputKeys,
      prevInputsSatisfied: p.inputsSatisfied,
      s,
      debtPool,
      collateralPool,
      a,
      vaultAdapter,
    })),
    map(
      ({
        prevInputsSatisfied,
        prevCalculateInputKeys,
        s,
        debtPool,
        collateralPool,
        a,
        vaultAdapter,
      }) => {
        const {
          requiredArgs,
          calculateCollateralOptions,
          calculateDebtOptions,
        } = getTradeConfig(s.tradeType);

        // Skip the rest of the trade logic if this is set to true
        if (s.maxWithdraw) return undefined;

        const [inputs, keys] = requiredArgs.reduce(
          ([inputs, keys], r) => {
            switch (r) {
              case 'collateralPool':
                return [
                  Object.assign(inputs, { collateralPool }),
                  [...keys, collateralPool?.hashKey || ''],
                ];
              case 'vaultAdapter':
                return [
                  Object.assign(inputs, { vaultAdapter }),
                  [...keys, vaultAdapter?.hashKey || ''],
                ];
              case 'debtPool':
                return [
                  Object.assign(inputs, { debtPool }),
                  [...keys, debtPool?.hashKey || ''],
                ];
              case 'balances':
                return [
                  Object.assign(inputs, { balances: a?.balances }),
                  [...keys, ...(a?.balances.map((b) => b.hashKey) || [])],
                ];
              case 'collateral':
              case 'debt':
              case 'deposit':
                return [
                  Object.assign(inputs, { [r]: s[r] }),
                  [...keys, (s[r] as TokenDefinition | undefined)?.id || ''],
                ];
              case 'depositBalance':
              case 'debtBalance':
              case 'collateralBalance':
                return [
                  Object.assign(inputs, { [r]: s[r] }),
                  [...keys, (s[r] as TokenBalance | undefined)?.hashKey || ''],
                ];
              case 'riskFactorLimit': {
                const risk = s[r] as
                  | RiskFactorLimit<RiskFactorKeys>
                  | undefined;
                return [
                  Object.assign(inputs, { [r]: risk }),
                  [
                    ...keys,
                    `${risk?.riskFactor}:${
                      isHashable(risk?.limit)
                        ? risk?.limit.hashKey
                        : risk?.limit.toString()
                    }:${risk?.args
                      ?.map((t) => (typeof t === 'number' ? t : t?.id))
                      .join(':')}`,
                  ],
                ];
              }
              case 'maxCollateralSlippage':
              case 'maxDebtSlippage':
                return [
                  Object.assign(inputs, { [r]: s[r] }),
                  [...keys, (s[r] as number | undefined)?.toString() || ''],
                ];
              default:
                return [inputs, keys];
            }
          },
          [{} as Record<CalculationFnParams, unknown>, [] as string[]]
        );

        const inputsSatisfied = requiredArgs.every(
          (r) => inputs[r] !== undefined
        );
        const calculateInputKeys = keys.join('|');
        return prevInputsSatisfied !== inputsSatisfied ||
          prevCalculateInputKeys !== calculateInputKeys
          ? {
              inputs,
              inputsSatisfied,
              calculateInputKeys,
              // If we can submit at this point, show the alternative options
              collateralTokens: calculateCollateralOptions
                ? s.availableCollateralTokens
                : undefined,
              debtTokens: calculateDebtOptions
                ? s.availableDebtTokens
                : undefined,
              tradeType: s.tradeType,
            }
          : undefined;
      }
    ),
    filterEmpty(),
    map((u) => {
      const { inputsSatisfied, inputs, tradeType } = u;
      let calculateError: string | undefined;
      const { calculationFn, requiredArgs } = getTradeConfig(tradeType);

      if (inputsSatisfied) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const outputs = calculationFn(inputs as any);

          return {
            ...u,
            ...outputs,
            calculateError,
            calculationSuccess: true,
          };
        } catch (e) {
          calculateError = (e as Error).toString();
        }
      }

      // NOTE: clear any calculated inputs if the new calculation fails
      const clearCalculatedInputs = requiredArgs.reduce((o, a) => {
        if (a === 'collateral' && tradeType !== 'RollDebt') {
          return Object.assign(o, { collateralBalance: undefined });
        } else if (a === 'debt' && tradeType !== 'ConvertAsset') {
          return Object.assign(o, { debtBalance: undefined });
        } else if (a === 'deposit') {
          return Object.assign(o, { depositBalance: undefined });
        } else {
          return o;
        }
      }, {});

      return {
        ...u,
        calculationSuccess: false,
        calculateError,
        ...clearCalculatedInputs,
      };
    }),
    map(({ inputs, collateralTokens, debtTokens, tradeType, ...u }) => {
      const {
        calculationFn,
        requiredArgs,
        calculateCollateralOptions,
        calculateDebtOptions,
      } = getTradeConfig(tradeType);

      let collateralOptions: TokenOption[] | undefined;
      let debtOptions: TokenOption[] | undefined;

      if (
        calculateCollateralOptions &&
        collateralTokens &&
        requiredArgs
          .filter((c) => c !== 'collateral')
          .every((r) => inputs[r] !== undefined) &&
        inputs['collateralPool'] !== undefined
      ) {
        collateralOptions = computeCollateralOptions(
          inputs,
          calculationFn,
          collateralTokens,
          inputs['collateralPool'] as fCashMarket
        );
      }

      if (
        calculateDebtOptions &&
        debtTokens &&
        requiredArgs
          .filter((c) => c !== 'debt')
          .filter((c) => (isVaultTrade(tradeType) ? c !== 'collateral' : true))
          .every((r) => inputs[r] !== undefined) &&
        inputs['debtPool'] !== undefined
      ) {
        debtOptions = computeDebtOptions(
          inputs,
          calculationFn,
          debtTokens,
          inputs['debtPool'] as fCashMarket,
          tradeType
        );
      }

      return { ...u, collateralOptions, debtOptions };
    })
  );
}

function computeCollateralOptions(
  inputs: Record<CalculationFnParams, unknown>,
  calculationFn: CalculationFn,
  options: TokenDefinition[],
  fCashMarket: fCashMarket
): TokenOption[] | undefined {
  return options.map((c) => {
    const i = { ...inputs, collateral: c };
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { collateralBalance, netRealizedCollateralBalance } = calculationFn(
        i as any
      ) as {
        collateralBalance: TokenBalance;
        netRealizedCollateralBalance: TokenBalance;
      };

      return {
        token: c,
        balance: collateralBalance,
        interestRate: _getTradedInterestRate(
          netRealizedCollateralBalance,
          collateralBalance,
          fCashMarket
        ),
      };
    } catch (e) {
      console.error(e);
      return {
        token: c,
        interestRate: undefined,
        error: (e as Error).toString(),
      };
    }
  });
}

function computeDebtOptions(
  inputs: Record<CalculationFnParams, unknown>,
  calculationFn: CalculationFn,
  options: TokenDefinition[],
  fCashMarket: fCashMarket,
  tradeType: TradeType | VaultTradeType | undefined
) {
  return options.map((d) => {
    const i = { ...inputs, debt: d };
    try {
      if (isVaultTrade(tradeType)) {
        // Switch to the matching vault share token for vault trades
        if (!d.vaultAddress || !d.maturity) throw Error('Invalid debt token');
        i['collateral'] = Registry.getTokenRegistry().getVaultShare(
          d.network,
          d.vaultAddress,
          d.maturity
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { debtBalance, netRealizedDebtBalance } = calculationFn(
        i as any
      ) as {
        debtBalance: TokenBalance;
        netRealizedDebtBalance: TokenBalance;
      };

      return {
        token: d,
        balance: debtBalance,
        interestRate: _getTradedInterestRate(
          netRealizedDebtBalance,
          debtBalance.unwrapVaultToken(),
          fCashMarket,
          tradeType
        ),
      };
    } catch (e) {
      console.error(e);
      return {
        token: d,
        interestRate: undefined,
        error: (e as Error).toString(),
      };
    }
  });
}

function _getTradedInterestRate(
  realized: TokenBalance,
  amount: TokenBalance,
  fCashMarket: fCashMarket,
  tradeType?: TradeType | VaultTradeType
) {
  let interestRate: number | undefined;
  if (amount.tokenType === 'fCash') {
    interestRate = fCashMarket.getImpliedInterestRate(realized, amount);
  } else if (amount.tokenType === 'PrimeCash') {
    // Increases or decreases the prime supply accordingly
    const utilization = fCashMarket.getPrimeCashUtilization(amount, undefined);
    interestRate = fCashMarket.getPrimeSupplyRate(utilization);
  } else if (
    amount.tokenType === 'PrimeDebt' &&
    (tradeType === 'LeveragedLend' || tradeType === 'LeveragedNToken')
  ) {
    // If borrowing for leverage it is prime supply + prime debt
    const utilization = fCashMarket.getPrimeCashUtilization(
      amount.toPrimeCash().neg(),
      amount.neg()
    );
    interestRate = fCashMarket.getPrimeDebtRate(utilization);
  } else if (amount.tokenType === 'PrimeDebt') {
    // If borrowing and withdrawing then it is just prime debt increase. This
    // includes vault debt
    const utilization = fCashMarket.getPrimeCashUtilization(
      undefined,
      amount.neg()
    );
    interestRate = fCashMarket.getPrimeDebtRate(utilization);
  }

  return interestRate !== undefined
    ? (interestRate * 100) / RATE_PRECISION
    : undefined;
}
