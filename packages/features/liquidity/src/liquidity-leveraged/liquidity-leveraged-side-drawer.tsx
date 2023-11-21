import { useContext } from 'react';
import { SideDrawerRouter } from '@notional-finance/trade';
import { LiquidityContext } from '../liquidity';
import { PRODUCTS } from '@notional-finance/util';
import {
  AdjustLeverage,
  CreateOrIncreasePosition,
  ManageLeveragedLiquidity,
  RollMaturity,
  Withdraw,
} from './side-drawers';
import { useLeveragedNTokenPositions } from './hooks/use-leveraged-ntoken-positions';
import { useParams } from 'react-router';
import { RiskFactorLimit } from '@notional-finance/risk-engine';
import { TokenBalance } from '@notional-finance/core-entities';

export const LiquidityLeveragedSideDrawer = () => {
  const context = useContext(LiquidityContext);
  // NOTE: need to use the URL parameter or infinite loop conditions will exist
  const { selectedDepositToken } = useParams<{
    selectedDepositToken?: string;
  }>();
  const {
    state: {
      customizeLeverage,
      debt,
      availableDebtTokens,
      defaultLeverageRatio,
      deposit,
      riskFactorLimit,
    },
  } = context;
  const loaded = deposit && deposit?.symbol === selectedDepositToken;

  const { currentPosition } = useLeveragedNTokenPositions(selectedDepositToken);
  const currentPositionState = {
    collateral: currentPosition?.asset.token,
    debt: currentPosition?.debt.token,
    riskFactorLimit: currentPosition?.leverageRatio
      ? ({
          riskFactor: 'leverageRatio',
          limit: currentPosition?.leverageRatio,
          args: [currentPosition?.asset.currencyId],
        } as RiskFactorLimit<'leverageRatio'>)
      : undefined,
  };

  return (
    <SideDrawerRouter
      context={context}
      hasPosition={!!currentPosition}
      routeMatch={`/${PRODUCTS.LIQUIDITY_LEVERAGED}/:path/${selectedDepositToken}`}
      defaultHasPosition={`IncreaseLeveragedNToken`}
      defaultNoPosition={`CreateLeveragedNToken`}
      routes={[
        {
          isRootDrawer: true,
          slug: 'CreateLeveragedNToken',
          Component: CreateOrIncreasePosition,
          requiredState: {
            tradeType: 'LeveragedNToken',
            debt: loaded
              ? customizeLeverage
                ? debt
                : availableDebtTokens?.find((t) => t.tokenType === 'PrimeDebt')
              : undefined,
            riskFactorLimit:
              loaded && deposit && defaultLeverageRatio && !customizeLeverage
                ? {
                    riskFactor: 'leverageRatio',
                    limit: defaultLeverageRatio,
                    args: [deposit.currencyId],
                  }
                : undefined,
          },
        },
        {
          isRootDrawer: true,
          slug: 'IncreaseLeveragedNToken',
          Component: CreateOrIncreasePosition,
          requiredState: {
            tradeType: 'IncreaseLeveragedNToken',
            selectedDepositToken,
            ...currentPositionState,
            customizeLeverage: true,
          },
        },
        {
          slug: 'Manage',
          Component: ManageLeveragedLiquidity,
          requiredState: {
            tradeType: 'RollDebt',
            ...(currentPosition?.debt.tokenType === 'PrimeDebt'
              ? {
                  collateral: currentPosition?.debt.toPrimeCash().token,
                  collateralBalance: currentPosition?.debt.toPrimeCash().neg(),
                }
              : {
                  collateral: currentPosition?.debt.token,
                  collateralBalance: currentPosition?.debt.neg(),
                }),
            selectedDepositToken,
            customizeLeverage: true,
          },
        },
        {
          slug: 'RollMaturity',
          Component: RollMaturity,
          requiredState: {
            tradeType: 'RollDebt',
            // Always roll the entire debt when doing roll debt from this
            // screen. Partial rolls will break up the grouping.
            maxWithdraw: true,
            customizeLeverage: true,
          },
        },
        {
          slug: 'AdjustLeverage',
          Component: AdjustLeverage,
          requiredState: {
            tradeType: 'LeveragedNTokenAdjustLeverage',
            depositBalance: loaded ? TokenBalance.zero(deposit) : undefined,
            // NOTE: debt and collateral will change based on where the requested
            // leverage ratio sits in relation to the current leverage
            riskFactorLimit: riskFactorLimit
              ? undefined
              : currentPositionState?.riskFactorLimit,
            customizeLeverage: true,
          },
        },
        {
          slug: 'Withdraw',
          Component: Withdraw,
          requiredState: {
            tradeType: 'DeleverageWithdraw',
            // NOTE: during withdraw the debt and asset are flipped
            collateral:
              currentPosition?.debt.tokenType === 'PrimeDebt'
                ? currentPosition?.debt.toPrimeCash().token
                : currentPosition?.debt.token,
            debt: currentPosition?.asset.token,
            riskFactorLimit: currentPositionState?.riskFactorLimit,
            selectedDepositToken,
            customizeLeverage: true,
          },
        },
      ]}
    />
  );
};