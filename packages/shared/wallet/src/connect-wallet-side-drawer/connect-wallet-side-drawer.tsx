import { useCallback } from 'react';
import { Box, styled } from '@mui/material';
import { LabelValue, SideDrawerActiveButton } from '@notional-finance/mui';
import { FormattedMessage } from 'react-intl';
import { useSideDrawerManager } from '@notional-finance/side-drawer';
import { ViewAsAccount } from '../view-as-account/view-as-account';
import { modules } from '../onboard-context';
import { useConnect } from '../hooks/use-connect';
import { useLocation } from 'react-router-dom';
import { useAccountReady } from '@notional-finance/notionable-hooks';

export const ConnectWalletSideDrawer = () => {
  const { connectWallet, currentLabel } = useConnect();
  const { pathname } = useLocation();
  const connected = useAccountReady();
  const { clearWalletSideDrawer } = useSideDrawerManager();

  const handleConnect = useCallback(
    (label: string) => {
      connectWallet(label);
      clearWalletSideDrawer();
    },
    [clearWalletSideDrawer, connectWallet]
  );

  return (
    <>
      <Box>
        <Title>
          {connected ? (
            <FormattedMessage defaultMessage="Switch wallets" />
          ) : (
            <FormattedMessage defaultMessage="Connect a Wallet" />
          )}
        </Title>
        {modules.map(({ label, icon }, index) => {
          const image = (
            <img
              src={icon}
              style={{ height: '35px', width: '35px' }}
              alt="wallet icon"
            />
          );
          return (
            <SideDrawerActiveButton
              label={label}
              Icon={image}
              dataKey={label}
              selectedKey={currentLabel}
              callback={handleConnect}
              key={index}
            />
          );
        })}
      </Box>
      {!pathname.includes('contest') && <ViewAsAccount />}
    </>
  );
};

const Title = styled(LabelValue)(
  ({ theme }) => `
  margin-bottom: ${theme.spacing(2.5)};
  margin-top: ${theme.spacing(3)};
  font-weight: 700;
  color: ${theme.palette.borders.accentDefault};
  display: flex;
  text-transform: uppercase;
  `
);

export default ConnectWalletSideDrawer;
