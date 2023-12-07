import { Box, styled, useTheme } from '@mui/material';
import { useSideNav } from '../../hooks';
import { PortfolioParams } from '../../portfolio-feature-shell';
import { Link, LinkProps, useParams } from 'react-router-dom';
import { PORTFOLIO_CATEGORIES } from '@notional-finance/util';
import { NotionalTheme } from '@notional-finance/styles';
import { H5, Caption } from '@notional-finance/mui';
import { navLabels } from './messages';

interface SideNavItemProps extends LinkProps {
  theme: NotionalTheme;
  selected?: boolean;
  open?: boolean;
}
interface SideNavOptonsProps {
  open?: boolean;
}

export const SideNavOptons = ({ open }: SideNavOptonsProps) => {
  const theme = useTheme();
  const { sideNavOptions } = useSideNav();
  const { category } = useParams<PortfolioParams>();

  return (
    <Box>
      {sideNavOptions.map(({ id, Icon, notifications, to }) => {
        return (
          <SideNavItem
            key={id}
            selected={
              category ? category === id : id === PORTFOLIO_CATEGORIES.OVERVIEW
            }
            theme={theme}
            to={to}
          >
            <Box sx={{ paddingRight: theme.spacing(4), display: 'flex' }}>
              {Icon}
              {notifications > 0 && open === false && <Dot></Dot>}
            </Box>
            <TitleWrapper>
              <H5
                contrast={category === id}
                msg={navLabels[id]}
                sx={{ whiteSpace: 'nowrap' }}
              />
              <Box sx={{ paddingLeft: theme.spacing(2) }}>
                {notifications > 0 && (
                  <NotificationNum>{notifications}</NotificationNum>
                )}
              </Box>
            </TitleWrapper>
          </SideNavItem>
        );
      })}
    </Box>
  );
};

const NotificationNum = styled(Caption)(
  ({ theme }) => `
    border-radius: 50%;
    width: 1.4rem;
    height: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${theme.palette.primary.light};
    color: ${theme.palette.background.default};
  `
);

const TitleWrapper = styled(Box)(
  () => `
    display: flex;
    align-content: center;
    align-items: center;
    flex: 1;
    justify-content: space-between;
  `
);

const Dot = styled(Box)(
  ({ theme }) => `
    height: 10px;
    width: 10px;
    background-color: ${theme.palette.typography.accent};
    border-radius: 50%;
    display: none;
    margin-left: -3px;
    margin-top: -2px;
    ${theme.breakpoints.down('xxl')} {
      display: inline-block;
    }
  `
);

const SideNavItem = styled(Link, {
  shouldForwardProp: (prop: string) => prop !== 'selected',
})(
  ({ theme, selected }: SideNavItemProps) => `
    height: ${theme.spacing(8)};
    width: 100%;
    background: ${selected ? theme.palette.primary.dark : 'transparent'};
    border-radius: 0px;
    padding-left: 28px;
    padding-right: 28px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    color: ${
      selected ? theme.palette.common.white : theme.palette.typography.light
    };
    &:hover {
      ${
        !selected
          ? `transition: .5s ease;
          background: ${theme.palette.borders.paper};
          `
          : ''
      }
      cursor: pointer;
    }
    `
);

export default SideNavOptons;
