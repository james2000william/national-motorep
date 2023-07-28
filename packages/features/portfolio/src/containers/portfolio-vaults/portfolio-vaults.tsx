import { DataTable } from '@notional-finance/mui';
import { TableActionRow } from '../../components';
import { FormattedMessage } from 'react-intl';
import { useVaultHoldingsTable } from '../../hooks';

export const PortfolioVaults = () => {
  const {
    vaultHoldingsColumns,
    vaultHoldingsData,
    setExpandedRows,
    initialState,
  } = useVaultHoldingsTable();

  return (
    <DataTable
      data={vaultHoldingsData}
      columns={vaultHoldingsColumns}
      CustomRowComponent={TableActionRow}
      tableTitle={
        <FormattedMessage
          defaultMessage="Leveraged Vaults"
          description="table title"
        />
      }
      initialState={initialState}
      setExpandedRows={setExpandedRows}
    />
  );
};

export default PortfolioVaults;
