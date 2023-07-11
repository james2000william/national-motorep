import { Registry } from '@notional-finance/core-entities';
import { convertRateToFloat } from '@notional-finance/helpers';
import { isVaultTrade } from '@notional-finance/notionable';
import {
  TradeContext,
  useFCashMarket,
} from '@notional-finance/notionable-hooks';
import { formatInterestRate } from '@notional-finance/util';
import { useCallback, useContext } from 'react';

export const useMaturitySelect = (
  category: 'Collateral' | 'Debt',
  context: TradeContext
) => {
  const {
    state: {
      availableCollateralTokens,
      availableDebtTokens,
      collateral,
      debt,
      collateralOptions,
      debtOptions,
      deposit,
      tradeType,
    },
    updateState,
  } = useContext(context);
  const tokens =
    category === 'Collateral' ? availableCollateralTokens : availableDebtTokens;
  const selectedToken = category === 'Collateral' ? collateral : debt;
  const options = category === 'Collateral' ? collateralOptions : debtOptions;
  const currencyId =
    deposit?.currencyId ||
    selectedToken?.currencyId ||
    options?.find((_) => !!_)?.currencyId;

  const fCashMarket = useFCashMarket(currencyId);
  const spotRates = fCashMarket?.getSpotInterestRates();
  const tokenRegistry = Registry.getTokenRegistry();
  const isVault = isVaultTrade(tradeType);

  // TODO: maybe put a use memo in here..
  const maturityData =
    fCashMarket && spotRates && tokens
      ? tokens
          .filter((_t) => {
            const t = tokenRegistry.unwrapVaultToken(_t);
            return t.tokenType === 'fCash' && t.currencyId === currencyId;
          })
          .sort((t) => t.maturity || 0)
          .map((t, i) => {
            const index = tokens.findIndex((_t) => _t.id === t.id);
            const option = options ? options[index] : undefined;
            let tradeRate: number | undefined;
            if (option && !option.isZero()) {
              let { tokensOut } = fCashMarket.calculateTokenTrade(
                option.unwrapVaultToken().neg(),
                0
              );

              if (isVault) {
                ({ cashBorrowed: tokensOut } =
                  Registry.getConfigurationRegistry().getVaultBorrowWithFees(
                    option.network,
                    option.vaultAddress,
                    option.maturity,
                    tokensOut.toUnderlying()
                  ));
              }

              tradeRate = fCashMarket.getImpliedInterestRate(
                tokensOut,
                option.unwrapVaultToken()
              );
            } else if (option === null) {
              // This signifies an error
              tradeRate = undefined;
            } else {
              tradeRate = spotRates[i];
            }

            return {
              fCashId: t.id,
              tradeRate: tradeRate ? convertRateToFloat(tradeRate) : undefined,
              maturity: t.maturity || 0,
              hasLiquidity: true,
              tradeRateString: tradeRate ? formatInterestRate(tradeRate) : '',
            };
          })
      : [];

  const onSelect = useCallback(
    (selectedId: string | undefined) => {
      if (category === 'Collateral') {
        const selectedCollateralToken = availableCollateralTokens?.find(
          (t) => t.id === selectedId
        )?.symbol;
        updateState({ selectedCollateralToken });
      } else if (isVault) {
        // Selects the matching vault collateral asset when the debt asset is selected
        const selectedDebt = availableDebtTokens?.find(
          (t) => t.id === selectedId
        );
        const selectedCollateral = availableCollateralTokens?.find(
          (t) => t.maturity === selectedDebt?.maturity
        );
        updateState({
          selectedDebtToken: selectedDebt?.symbol,
          selectedCollateralToken: selectedCollateral?.symbol,
        });
      } else {
        const selectedDebtToken = availableDebtTokens?.find(
          (t) => t.id === selectedId
        )?.symbol;
        updateState({ selectedDebtToken });
      }
    },
    [
      availableCollateralTokens,
      availableDebtTokens,
      updateState,
      category,
      isVault,
    ]
  );

  return { maturityData, selectedfCashId: selectedToken?.id, onSelect };
};