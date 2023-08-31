import { ToggleSwitchProps } from '@notional-finance/mui';
import { TransactionSidebar } from '@notional-finance/trade';
import { useParams } from 'react-router';
import { useSideDrawerManager } from '@notional-finance/side-drawer';
import { PortfolioParams } from '../../portfolio-feature-shell';
import { useCallback } from 'react';
import { TradeContext } from '@notional-finance/notionable-hooks';
import { Box, useTheme } from '@mui/material';

interface PortfolioSideDrawerProps {
  children?: React.ReactNode | React.ReactNode[];
  advancedToggle?: ToggleSwitchProps;
  context: TradeContext;
}

export const PortfolioSideDrawer = ({
  context,
  children,
  advancedToggle,
}: PortfolioSideDrawerProps) => {
  const theme = useTheme();
  const { category } = useParams<PortfolioParams>();

  const returnToPortfolio = `/portfolio/${category}`;
  const { clearSideDrawer } = useSideDrawerManager();

  const onCancel = useCallback(() => {
    console.log('onCancel');
    clearSideDrawer(returnToPortfolio);
  }, [clearSideDrawer, returnToPortfolio]);

  return (
    <TransactionSidebar
      context={context}
      isPortfolio
      onCancelCallback={onCancel}
      onReturnToForm={onCancel}
      advancedToggle={advancedToggle}
    >
      <Box sx={{ marginBottom: theme.spacing(6) }}>{children}</Box>
    </TransactionSidebar>
  );
};
