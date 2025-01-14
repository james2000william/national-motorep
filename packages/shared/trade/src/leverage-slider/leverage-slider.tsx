import {
  CountUp,
  PageLoading,
  SliderInput,
  SliderInputProps,
  useSliderInputRef,
} from '@notional-finance/mui';
import { FormattedMessage } from 'react-intl';
import { BaseTradeContext } from '@notional-finance/notionable-hooks';
import { useCallback, useEffect, useMemo } from 'react';
import { MessageDescriptor } from 'react-intl';
import { TokenBalance } from '@notional-finance/core-entities';
import { isDeleverageWithSwappedTokens } from '@notional-finance/notionable';

interface LeverageSliderProps {
  context: BaseTradeContext;
  inputLabel: MessageDescriptor;
  cashBorrowed?: TokenBalance;
  errorMsg?: MessageDescriptor;
  infoMsg?: MessageDescriptor;
  bottomCaption?: JSX.Element;
  leverageCurrencyId?: number;
  isDeleverage?: boolean;
  showMinMax?: boolean;
  additionalSliderInfo?: SliderInputProps['sliderLeverageInfo'];
  onChange?: (leverageRatio: number) => void;
}

export const LeverageSlider = ({
  inputLabel,
  errorMsg,
  infoMsg,
  cashBorrowed,
  bottomCaption,
  context,
  leverageCurrencyId,
  isDeleverage,
  showMinMax,
  additionalSliderInfo = [],
  onChange,
}: LeverageSliderProps) => {
  const {
    state: {
      riskFactorLimit,
      debtBalance,
      collateralBalance,
      deposit,
      maxLeverageRatio,
      minLeverageRatio,
      collateral,
      debtOptions,
      collateralOptions,
      debt,
    },
    updateState,
  } = context;
  const { sliderInputRef, setSliderInput } = useSliderInputRef();
  const borrowRate = isDeleverageWithSwappedTokens(context.state)
    ? collateralOptions?.find((o) => o.token.id === collateral?.id)
        ?.interestRate
    : debtOptions?.find((o) => o.token.id === debt?.id)?.interestRate;
  const topRightCaption =
    borrowRate !== undefined ? (
      <>
        <CountUp value={borrowRate} suffix={'%'} decimals={2} />
        &nbsp;
        {isDeleverage ? (
          <FormattedMessage defaultMessage={'Repay APY'} />
        ) : (
          <FormattedMessage defaultMessage={'Borrow APY'} />
        )}
      </>
    ) : undefined;

  const zeroUnderlying = useMemo(() => {
    return deposit ? TokenBalance.zero(deposit) : undefined;
  }, [deposit]);

  const onChangeCommitted = useCallback(
    (leverageRatio: number) => {
      if (!isFinite(leverageRatio)) return;

      updateState({
        riskFactorLimit: {
          riskFactor: 'leverageRatio',
          limit: leverageRatio,
          args: leverageCurrencyId ? [leverageCurrencyId] : undefined,
        },
      });
    },
    [updateState, leverageCurrencyId]
  );

  useEffect(() => {
    // If the component is mounted and the ref does not match the defined limit, set it
    // to match the store. This happens because the slider initializes to a min value on
    // component mount.
    if (
      !!riskFactorLimit?.limit &&
      riskFactorLimit.limit !== sliderInputRef.current?.getInputValue()
    ) {
      setSliderInput(riskFactorLimit.limit as number, false);
    }
  });

  const sliderLeverageInfo = [
    {
      caption: isDeleverage ? (
        <FormattedMessage defaultMessage={'Debt Repaid'} />
      ) : (
        <FormattedMessage defaultMessage={'Borrow Amount'} />
      ),
      value: cashBorrowed
        ? cashBorrowed.toUnderlying().abs().toFloat()
        : debtBalance?.toUnderlying().abs().toFloat() ||
          `- ${zeroUnderlying?.symbol || ''}`,
      suffix: ` ${zeroUnderlying?.symbol || ''}`,
    },
    {
      caption: isDeleverage ? (
        <FormattedMessage defaultMessage={'Assets Sold'} />
      ) : (
        <FormattedMessage defaultMessage={'Asset Amount'} />
      ),
      value:
        collateralBalance?.abs().toUnderlying().toFloat() ||
        `- ${zeroUnderlying?.symbol || ''}`,
      suffix: ` ${zeroUnderlying?.symbol || ''}`,
    },
    ...additionalSliderInfo,
  ];

  return maxLeverageRatio ? (
    <SliderInput
      ref={sliderInputRef}
      min={minLeverageRatio || 0}
      max={maxLeverageRatio}
      onChangeCommitted={onChange || onChangeCommitted}
      infoMsg={infoMsg}
      errorMsg={errorMsg}
      showMinMax={showMinMax}
      topRightCaption={topRightCaption}
      bottomCaption={bottomCaption}
      inputLabel={inputLabel}
      sliderLeverageInfo={sliderLeverageInfo}
    />
  ) : (
    <PageLoading />
  );
};
