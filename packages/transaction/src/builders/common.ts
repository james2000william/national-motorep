import { NotionalV3, NotionalV3ABI } from '@notional-finance/contracts';
import { BigNumber, Contract, ethers, PayableOverrides } from 'ethers';
import {
  BASIS_POINT,
  getProviderFromNetwork,
  Network,
  NotionalAddress,
  unique,
} from '@notional-finance/util';
import {
  fCashMarket,
  Registry,
  TokenBalance,
} from '@notional-finance/core-entities';
import { BalanceActionStruct } from '@notional-finance/contracts/types/NotionalV3';
import {
  BalanceActionWithTradesStruct,
  BatchLendStruct,
} from '@notional-finance/contracts/types/Notional';

export enum TradeActionType {
  Lend,
  Borrow,
  _AddLiquidity,
  _RemoveLiquidity,
  PurchaseNTokenResidual,
  _SettleCashDebt,
}

export enum DepositActionType {
  None,
  _DepositAsset,
  DepositUnderlying,
  _DepositAssetAndMintNToken,
  DepositUnderlyingAndMintNToken,
  RedeemNToken,
  ConvertCashToNToken,
}

export interface PopulateTransactionInputs {
  address: string;
  network: Network;
  depositBalance?: TokenBalance;
  debtBalance?: TokenBalance;
  collateralBalance?: TokenBalance;
  redeemToWETH: boolean;
  accountBalances: TokenBalance[];
}

export function hasExistingCashBalance(
  tokenBalance: TokenBalance,
  balances: TokenBalance[]
) {
  const cashBalance = balances.find(
    (b) =>
      (b.tokenType === 'PrimeCash' || b.tokenType === 'PrimeDebt') &&
      b.token.currencyId === tokenBalance.currencyId
  );

  const withdrawEntireCashBalance = cashBalance ? false : true;
  const withdrawAmountInternalPrecision =
    cashBalance?.tokenType === 'PrimeCash'
      ? // If there is a prime cash balance, withdraw the deposit balance (which is
        // the withdraw amount here)
        tokenBalance.toPrimeCash().neg()
      : tokenBalance?.tokenType === 'PrimeDebt'
      ? // If there is a prime debt balance, then withdraw the net amount after repayment
        tokenBalance.toPrimeCash().neg().add(tokenBalance.toPrimeCash())
      : undefined;

  return {
    cashBalance,
    withdrawEntireCashBalance,
    // Floor this value at zero
    withdrawAmountInternalPrecision:
      withdrawAmountInternalPrecision?.isNegative()
        ? withdrawAmountInternalPrecision.copy(0)
        : withdrawAmountInternalPrecision,
  };
}

export async function populateTxnAndGas(
  contract: Contract,
  msgSender: string,
  methodName: string,
  methodArgs: unknown[],
  gasBufferPercent = 5
) {
  const c = contract.connect(msgSender);
  // TODO: where do you get the revert reason here?
  const txn = await c.populateTransaction[methodName].apply(c, methodArgs);
  if (process.env['NODE_ENV'] !== 'test') {
    // NOTE: this fails inside unit tests for some reason
    const gasLimit = await c.estimateGas[methodName].apply(c, methodArgs);
    // Add 5% to the estimated gas limit to reduce the risk of out of gas errors
    txn.gasLimit = gasLimit.add(gasLimit.mul(gasBufferPercent).div(100));
  }

  return txn;
}

export async function populateNotionalTxnAndGas<
  M extends keyof NotionalV3['functions']
>(
  network: Network,
  msgSender: string,
  methodName: M,
  methodArgs: Parameters<NotionalV3['functions'][M]>,
  gasBufferPercent = 5
) {
  const contract = new Contract(
    NotionalAddress[network],
    NotionalV3ABI,
    getProviderFromNetwork(network)
  ) as NotionalV3;

  return populateTxnAndGas(
    contract,
    msgSender,
    methodName,
    methodArgs,
    gasBufferPercent
  );
}

export function getBatchLend(
  lendAmounts: TokenBalance[],
  slippageFactor?: number
): BatchLendStruct {
  const { trades, currencyId } = encodeTrades(lendAmounts, slippageFactor);

  return {
    currencyId,
    depositUnderlying: true,
    trades,
  };
}

export function getBalanceAndTradeAction(
  actionType: DepositActionType,
  amount: TokenBalance,
  withdrawEntireCashBalance: boolean,
  withdrawAmount: TokenBalance | undefined,
  redeemToWETH: boolean,
  fCash: TokenBalance[]
): BalanceActionWithTradesStruct {
  const balanceAction = getBalanceAction(
    actionType,
    amount,
    withdrawEntireCashBalance,
    withdrawAmount,
    redeemToWETH
  );
  const { trades, currencyId } = encodeTrades(fCash);
  if (currencyId !== amount.currencyId) throw Error('Mismatched currency ids');

  return {
    ...balanceAction,
    trades,
  };
}

export function encodeTrades(
  amounts: TokenBalance[],
  slippageFactor = 5 * BASIS_POINT
) {
  const currencyIds = unique(amounts.map((t) => t.currencyId));
  const networks = unique(amounts.map((t) => t.network));
  if (
    // Only accepts fCash
    !amounts.every((t) => t.tokenType === 'fCash') ||
    // All fCash must be in the same currency id
    currencyIds.length !== 1 ||
    // All fCash must be in the same network
    networks.length !== 1 ||
    // No two tokens can be in the same maturity
    unique(amounts.map((t) => t.token.maturity)).length !== amounts.length
  ) {
    throw Error('Invalid trade inputs');
  }
  const currencyId = currencyIds[0];
  const network = networks[0];
  const nToken = Registry.getTokenRegistry().getNToken(network, currencyId);
  const pool = Registry.getExchangeRegistry().getPoolInstance<fCashMarket>(
    network,
    nToken.address
  );

  return {
    trades: amounts.map((fCash) => {
      // 0 == LEND, 1 == BORROW
      const tradeActionType = fCash.isPositive() ? 0 : 1;
      const marketIndex = pool.getMarketIndex(fCash.token.maturity);
      const slippage = pool.getSlippageRate(fCash, slippageFactor);

      return ethers.utils.solidityPack(
        ['uint8', 'uint8', 'uint88', 'uint32', 'uint120'],
        [tradeActionType, marketIndex, fCash.n, slippage, BigNumber.from(0)]
      );
    }),
    currencyId,
    network,
  };
}

export function getBalanceAction(
  actionType: DepositActionType,
  amount: TokenBalance,
  withdrawEntireCashBalance: boolean,
  withdrawAmount: TokenBalance | undefined,
  redeemToWETH: boolean
): BalanceActionStruct {
  if (redeemToWETH && amount.token.symbol !== 'ETH') {
    throw Error('Cannot redeem to WETH');
  }

  if (
    (actionType === DepositActionType.DepositUnderlying ||
      actionType === DepositActionType.DepositUnderlyingAndMintNToken) &&
    amount.tokenType !== 'Underlying'
  ) {
    throw Error('Deposit amount has to be underlying');
  } else if (
    actionType === DepositActionType.ConvertCashToNToken &&
    amount.tokenType !== 'PrimeCash'
  ) {
    throw Error('Deposit amount has to be prime cash');
  } else if (
    actionType === DepositActionType.RedeemNToken &&
    amount.tokenType !== 'nToken'
  ) {
    throw Error('Deposit amount has to be nToken');
  }

  if (
    withdrawAmount &&
    (withdrawAmount.tokenType !== 'PrimeCash' ||
      withdrawAmount.token.currencyId !== amount.currencyId)
  ) {
    throw Error('Incorrect withdraw amount denomination');
  }

  const withdrawAmountInternalPrecision =
    withdrawAmount?.n || BigNumber.from(0);

  return {
    actionType,
    currencyId: amount.currencyId,
    depositActionAmount: amount.n,
    withdrawAmountInternalPrecision,
    withdrawEntireCashBalance,
    redeemToUnderlying: !redeemToWETH,
  };
}

export function getETHValue(balance: TokenBalance): PayableOverrides {
  return {
    value: balance.token.symbol === 'ETH' ? balance.n : BigNumber.from(0),
  };
}