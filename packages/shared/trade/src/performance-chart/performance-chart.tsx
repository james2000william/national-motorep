import {
  MultiDisplayChart,
  AreaChart,
  ChartContainer,
} from '@notional-finance/mui';
import { TradeState, VaultTradeState } from '@notional-finance/notionable';
import { usePerformanceChart } from './use-performance-chart';
import { Box, useTheme } from '@mui/material';
import { TokenDefinition } from '@notional-finance/core-entities';
import { FormattedMessage } from 'react-intl';

export const PerformanceChart = ({
  state,
  priorVaultFactors,
}: {
  state: TradeState | VaultTradeState;
  priorVaultFactors?: {
    vaultShare?: TokenDefinition;
    isPrimeBorrow: boolean;
    vaultBorrowRate?: number;
    leverageRatio?: number;
  };
}) => {
  const theme = useTheme();
  const {
    areaChartData,
    areaChartStyles,
    areaChartHeaderData,
    currentLeveragedReturn,
    chartToolTipData,
  } = usePerformanceChart(state, priorVaultFactors);

  return (
    <Box marginBottom={theme.spacing(5)}>
      <MultiDisplayChart
        chartComponents={[
          {
            id: 'area-chart',
            title: 'Performance To Date',
            Component: (
              <ChartContainer>
                <AreaChart
                  showEmptyState={
                    currentLeveragedReturn === undefined ? true : false
                  }
                  emptyStateMessage={
                    <FormattedMessage
                      defaultMessage={'Fill in inputs to see leveraged returns'}
                    />
                  }
                  showCartesianGrid
                  xAxisTickFormat="date"
                  areaChartData={areaChartData}
                  condenseXAxisTime={true}
                  areaLineType="linear"
                  chartToolTipData={chartToolTipData}
                  areaChartStyles={areaChartStyles}
                />
              </ChartContainer>
            ),
            chartHeaderData: areaChartHeaderData,
          },
        ]}
      />
    </Box>
  );
};
