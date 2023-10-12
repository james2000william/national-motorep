import { ReactNode } from 'react';
import { Box, useTheme } from '@mui/material';
import {
  TradeActionHeader,
  PageLoading,
  TradeSummaryContainer,
  TradeActionTitle,
} from '@notional-finance/mui';
import { BaseTradeState, isVaultTrade } from '@notional-finance/notionable';
import { TransactionHeadings } from '../transaction-sidebar/components/transaction-headings';
import { FormattedMessage } from 'react-intl';
import { useAllMarkets } from '@notional-finance/notionable-hooks';
import LeverageInfoRow from './components/leverage-info-row';
import { formatTokenType } from '@notional-finance/helpers';
import { TokenDefinition, YieldData } from '@notional-finance/core-entities';
import { leveragedYield } from '@notional-finance/util';
import { LiquidityYieldInfo } from './components/liquidity-yield-info';

interface TradeActionSummaryProps {
  state: BaseTradeState;
  liquidityYieldData?: YieldData;
  priorVaultFactors?: {
    vaultShare?: TokenDefinition;
    vaultBorrowRate?: number;
    leverageRatio?: number;
  };
  children?: ReactNode | ReactNode[];
}

export function TradeActionSummary({
  state,
  priorVaultFactors,
  liquidityYieldData,
  children,
}: TradeActionSummaryProps) {
  const theme = useTheme();
  const {
    tradeType,
    deposit,
    debt,
    collateralOptions,
    debtOptions,
    vaultConfig,
    riskFactorLimit,
    vaultAddress,
  } = state;
  const isVault = !!vaultAddress;
  const { nonLeveragedYields } = useAllMarkets();

  const messages = tradeType ? TransactionHeadings[tradeType] : undefined;
  const headerText = messages?.headerText;
  const isLeveraged =
    tradeType === 'LeveragedNToken' ||
    tradeType === 'LeveragedLend' ||
    isVaultTrade(tradeType) ||
    priorVaultFactors !== undefined;
  const collateral = state.collateral || priorVaultFactors?.vaultShare;

  const apySuffix = isLeveraged ? (
    <FormattedMessage defaultMessage={'Total APY'} />
  ) : tradeType === 'LendFixed' || tradeType === 'BorrowFixed' ? (
    <FormattedMessage defaultMessage={'Fixed APY'} />
  ) : (
    <FormattedMessage defaultMessage={'APY'} />
  );

  const selectedToken =
    (tradeType === 'LeveragedLend' ||
      'LeveragedNToken' ||
      tradeType === 'MintNToken') &&
    collateral
      ? formatTokenType(collateral).icon
      : deposit?.symbol;

  const tokenBottom =
    (tradeType === 'LeveragedNToken' || tradeType === 'LeveragedLend') && debt
      ? formatTokenType(debt).icon
      : undefined;

  const assetAPY =
    collateralOptions?.find((c) => c.token.id === collateral?.id)
      ?.interestRate ||
    nonLeveragedYields.find((y) => y.token.id === collateral?.id)?.totalAPY;

  const debtAPY =
    debtOptions?.find((d) => d.token.id === debt?.id)?.interestRate ||
    nonLeveragedYields.find((y) => y.token.id === debt?.id)?.totalAPY ||
    priorVaultFactors?.vaultBorrowRate;

  const apySpread =
    assetAPY !== undefined && debtAPY !== undefined
      ? assetAPY - debtAPY
      : undefined;
  const leverageRatio =
    riskFactorLimit?.riskFactor === 'leverageRatio'
      ? (riskFactorLimit.limit as number)
      : priorVaultFactors?.leverageRatio;

  let totalAPY: number | undefined;
  if (isLeveraged) {
    totalAPY = leveragedYield(assetAPY, debtAPY, leverageRatio);
  } else {
    totalAPY = assetAPY !== undefined ? assetAPY : debtAPY;
  }
  const { title } = collateral
    ? formatTokenType(collateral)
    : isVault
    ? { title: 'Vault Shares' }
    : { title: '' };

  if (!selectedToken) return <PageLoading />;

  return (
    <TradeSummaryContainer>
      <Box marginBottom={theme.spacing(5)}>
        <TradeActionHeader
          token={selectedToken}
          tokenBottom={tokenBottom}
          hideTokenName={isVault}
          actionText={
            isVault ? vaultConfig?.name : <FormattedMessage {...headerText} />
          }
        />
        <TradeActionTitle value={totalAPY} title={apySuffix} valueSuffix="%" />
        {isLeveraged && (
          <LeverageInfoRow
            assetSymbol={title}
            assetAPY={assetAPY}
            apySpread={apySpread}
            leverage={leverageRatio}
          />
        )}
        {liquidityYieldData && (
          <LiquidityYieldInfo liquidityYieldData={liquidityYieldData} />
        )}
      </Box>
      {children}
    </TradeSummaryContainer>
  );
}

export default TradeActionSummary;
