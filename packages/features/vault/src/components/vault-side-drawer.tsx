import { useContext, useCallback } from 'react';
import {
  ActionSidebar,
  ToggleSwitchProps,
  ProgressIndicator,
} from '@notional-finance/mui';
import { TradeActionButton, Confirmation2 } from '@notional-finance/trade';
import { VaultActionContext } from '../vault-view/vault-action-provider';
import { useHistory } from 'react-router';
import { messages } from '../messages';
import { VaultDetailsTable } from './vault-details-table';
import { useVaultProperties } from '@notional-finance/notionable-hooks';
import { useVaultCapacity } from '../hooks';
import { VaultTradeType } from '@notional-finance/notionable';

interface VaultSideDrawerProps {
  children?: React.ReactNode | React.ReactNode[];
  advancedToggle?: ToggleSwitchProps;
}

export const VaultSideDrawer = ({
  children,
  advancedToggle,
}: VaultSideDrawerProps) => {
  const history = useHistory();
  const {
    state: {
      vaultAddress,
      tradeType: _tradeType,
      canSubmit,
      confirm,
      populatedTransaction,
    },
    updateState,
  } = useContext(VaultActionContext);
  const { minDepositRequired } = useVaultProperties(vaultAddress);
  const { minBorrowSize } = useVaultCapacity();
  const tradeType = _tradeType as VaultTradeType;

  const handleCancel = useCallback(() => {
    history.push(`/vaults/${vaultAddress}`);
  }, [vaultAddress, history]);

  const handleSubmit = () => {
    updateState({ confirm: true });
  };

  return (
    <div>
      {tradeType ? (
        populatedTransaction && confirm ? (
          <Confirmation2
            heading={messages[tradeType].heading}
            context={VaultActionContext}
            onCancel={handleCancel}
            showDrawer={false}
            onReturnToForm={handleCancel}
          />
        ) : (
          <ActionSidebar
            heading={messages[tradeType].heading}
            helptext={{
              ...messages[tradeType].helptext,
              values: {
                minDepositRequired,
                minBorrowSize,
              },
            }}
            advancedToggle={advancedToggle}
            showDrawer={false}
            canSubmit={canSubmit}
            cancelRoute={''}
            CustomActionButton={TradeActionButton}
            handleSubmit={handleSubmit}
            hideTextOnMobile={false}
          >
            {children}
            <VaultDetailsTable key={'vault-risk-table'} />
          </ActionSidebar>
        )
      ) : (
        <ProgressIndicator type="notional" />
      )}
    </div>
  );
};
