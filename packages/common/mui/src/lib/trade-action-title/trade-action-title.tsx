import { useTheme } from '@mui/material';
import CountUp from '../count-up/count-up';
import { H1 } from '../typography/typography';

export interface TradeActionTitleProps {
  title: React.ReactNode;
  value?: number;
  valueSuffix?: string;
}

export function TradeActionTitle({
  title,
  value,
  valueSuffix = '',
}: TradeActionTitleProps) {
  const theme = useTheme();
  return (
    <H1
      sx={{
        color:
          value && value < 0
            ? theme.palette.error.main
            : theme.palette.typography.main,
      }}
    >
      {value !== undefined ? (
        <CountUp value={value} suffix={valueSuffix} decimals={3} delay={0.3} />
      ) : (
        '-'
      )}
      &nbsp;
      {title}
    </H1>
  );
}

export default TradeActionTitle;
