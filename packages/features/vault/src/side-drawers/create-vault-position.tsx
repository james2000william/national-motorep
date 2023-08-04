import { useContext } from 'react';
import { useCurrencyInputRef, PageLoading } from '@notional-finance/mui';
import { Box, styled, useTheme } from '@mui/material';
import { VaultActionContext } from '../vault-view/vault-action-provider';
import { VaultSideDrawer } from '../components/vault-side-drawer';
import { VaultLeverageSlider, MobileVaultSummary } from '../components';
import { useVaultActionErrors } from '../hooks';
import {
  DepositInput,
  VariableFixedMaturityToggle,
} from '@notional-finance/trade';
import { messages } from '../messages';

export const CreateVaultPosition = () => {
  const theme = useTheme();
  const context = useContext(VaultActionContext);
  const {
    state: { deposit },
  } = context;
  const { currencyInputRef } = useCurrencyInputRef();
  const { inputErrorMsg } = useVaultActionErrors();
  const primaryBorrowSymbol = deposit?.symbol;

  if (!primaryBorrowSymbol) return <PageLoading />;

  return (
    <>
      <SummaryWrapper>
        <MobileVaultSummary />
      </SummaryWrapper>
      <Box
        sx={{
          marginTop: {
            xs: theme.spacing(22),
            sm: theme.spacing(22),
            md: '0px',
          },
        }}
      >
        <VaultSideDrawer context={context}>
          <DepositInput
            ref={currencyInputRef}
            inputRef={currencyInputRef}
            context={context}
            errorMsgOverride={inputErrorMsg}
            inputLabel={messages['CreateVaultPosition'].depositAmount}
          />
          <VariableFixedMaturityToggle
            context={context}
            fCashInputLabel={messages['CreateVaultPosition'].maturity}
          />
          <VaultLeverageSlider
            context={context}
            inputLabel={messages['CreateVaultPosition'].leverage}
          />
        </VaultSideDrawer>
      </Box>
    </>
  );
};

const SummaryWrapper = styled(Box)(
  ({ theme }) => `
  display: none;
  ${theme.breakpoints.down('sm')} {
    display: block;
    position: fixed;
    top: ${theme.spacing(8.75)};
    left: 0;
    min-width: 100vw;
    z-index: 1;
  }
`
);
