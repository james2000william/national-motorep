import { useCallback } from 'react';
import {
  ActionSidebar,
  ToggleSwitchProps,
  ProgressIndicator,
} from '@notional-finance/mui';
import { TradeActionButton, Confirmation2 } from '@notional-finance/trade';
import { useHistory } from 'react-router';
import { messages } from '../messages';
import { VaultDetailsTable } from './vault-details-table';
import {
  VaultContext,
  useVaultProperties,
} from '@notional-finance/notionable-hooks';
import { useGeoipBlock } from '@notional-finance/helpers';
import { useVaultCapacity } from '../hooks';
import { VaultTradeType } from '@notional-finance/notionable';
import { FormattedMessage } from 'react-intl';

interface VaultSideDrawerProps {
  children?: React.ReactNode | React.ReactNode[];
  advancedToggle?: ToggleSwitchProps;
  context: VaultContext;
}

export const VaultSideDrawer = ({
  children,
  advancedToggle,
  context,
}: VaultSideDrawerProps) => {
  const isBlocked = useGeoipBlock();
  const history = useHistory();
  const {
    state: { vaultAddress, tradeType: _tradeType, canSubmit, confirm },
    updateState,
  } = context;
  const { minDepositRequired } = useVaultProperties(vaultAddress);
  const { minBorrowSize } = useVaultCapacity();
  const tradeType = _tradeType as VaultTradeType;

  const handleCancel = useCallback(() => {
    history.push(`/vaults/${vaultAddress}`);
    updateState({ confirm: false });
  }, [vaultAddress, updateState, history]);

  const handleSubmit = useCallback(() => {
    updateState({ confirm: true });
  }, [updateState]);

  if (!tradeType) return <ProgressIndicator type="notional" />;

  return confirm ? (
    <Confirmation2
      heading={<FormattedMessage {...messages[tradeType].heading} />}
      context={context}
      onCancel={handleCancel}
      showDrawer={false}
      onReturnToForm={handleCancel}
    />
  ) : (
    <ActionSidebar
      heading={messages[tradeType].heading}
      helptext={
        isBlocked
          ? messages.error.blockedGeoActionHelptext
          : {
              ...messages[tradeType].helptext,
              values: {
                minDepositRequired,
                minBorrowSize,
              },
            }
      }
      advancedToggle={advancedToggle}
      showDrawer={false}
      canSubmit={canSubmit && !isBlocked}
      cancelRoute={''}
      CustomActionButton={TradeActionButton}
      handleSubmit={handleSubmit}
      hideTextOnMobile={false}
    >
      {children}
      <VaultDetailsTable key={'vault-risk-table'} />
    </ActionSidebar>
  );
};
