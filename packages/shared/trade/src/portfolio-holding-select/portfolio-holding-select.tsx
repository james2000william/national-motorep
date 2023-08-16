import { AssetSelectDropdown } from '@notional-finance/mui';
import { useCallback, useEffect, useMemo } from 'react';
import { MessageDescriptor } from 'react-intl';
import {
  useFiat,
  BaseTradeContext,
  useAccountDefinition,
  usePortfolioRiskProfile,
  useCurrency,
} from '@notional-finance/notionable-hooks';
import { TokenBalance, TokenDefinition } from '@notional-finance/core-entities';
import { useParams } from 'react-router';

interface PortfolioHoldingSelectProps {
  context: BaseTradeContext;
  inputLabel: MessageDescriptor;
  isWithdraw?: boolean;
  filterBalances: (
    b: TokenBalance,
    index: number,
    arr: TokenBalance[]
  ) => boolean;
  errorMsg?: MessageDescriptor;
  tightMarginTop?: boolean;
}

export const PortfolioHoldingSelect = ({
  context,
  inputLabel,
  tightMarginTop,
  filterBalances,
  isWithdraw,
}: PortfolioHoldingSelectProps) => {
  const baseCurrency = useFiat();
  const {
    updateState,
    state: { collateral, debt },
  } = context;
  const { account } = useAccountDefinition();
  const { primeCash, primeDebt } = useCurrency();
  const profile = usePortfolioRiskProfile();
  const selectedToken = isWithdraw ? debt : collateral;
  const { selectedToken: selectedParamToken } = useParams<{
    selectedToken: string;
  }>();

  const selectedTokenId =
    !isWithdraw && selectedToken?.tokenType === 'PrimeCash'
      ? primeDebt.find((t) => t.currencyId === selectedToken.currencyId)?.id
      : selectedToken?.id;

  const options = useMemo(() => {
    return account?.balances.filter(filterBalances)?.map((b) => {
      if (isWithdraw) {
        const maxWithdraw = profile.maxWithdraw(b.token);
        return {
          token: b.token,
          largeFigure: maxWithdraw?.toUnderlying().toFloat() || 0,
          largeFigureSuffix: b.underlying.symbol,
        };
      } else {
        // isRepay
        const underlying = b.toUnderlying();
        return {
          token: b.token,
          largeFigure: underlying.toFloat() || 0,
          largeFigureSuffix: b.underlying.symbol,
          caption: underlying.toFiat(baseCurrency).toDisplayStringWithSymbol(),
        };
      }
    });
  }, [account, filterBalances, profile, isWithdraw, baseCurrency]);

  const onSelect = useCallback(
    (id: string | null) => {
      const c = options?.find((t) => t.token.id === id);
      updateState(isWithdraw ? { debt: c?.token } : { collateral: c?.token });
    },
    [updateState, options, isWithdraw]
  );

  useEffect(() => {
    if (!options || options.length === 0 || !!selectedToken) return;
    const option = selectedParamToken
      ? options.find((t) => t.token.id === selectedParamToken)
      : options[0];

    // If repaying prime debt we select prime cash as the collateral
    let selected: TokenDefinition | undefined;
    if (option?.token.tokenType === 'PrimeDebt' && !isWithdraw) {
      selected = primeCash.find(
        (t) => t.currencyId === option.token.currencyId
      );
    } else {
      selected = option?.token;
    }

    updateState(isWithdraw ? { debt: selected } : { collateral: selected });
  }, [
    options,
    selectedToken,
    updateState,
    isWithdraw,
    selectedParamToken,
    primeCash,
  ]);

  return (
    <AssetSelectDropdown
      tightMarginTop={tightMarginTop}
      selectedTokenId={selectedTokenId}
      inputLabel={inputLabel}
      onSelect={onSelect}
      options={options}
    />
  );
};
