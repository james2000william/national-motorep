import {
  PageLoading,
  SliderInput,
  useSliderInputRef,
} from '@notional-finance/mui';
import { defineMessage } from 'react-intl';
import { BaseContext } from '@notional-finance/notionable-hooks';
import { useContext, useEffect } from 'react';
import { MessageDescriptor } from 'react-intl';
import { TokenBalance } from '@notional-finance/core-entities';

interface LeverageSliderProps {
  context: BaseContext;
  inputLabel: MessageDescriptor;
  cashBorrowed?: TokenBalance;
  errorMsg?: MessageDescriptor;
  infoMsg?: MessageDescriptor;
  rightCaption?: JSX.Element;
  bottomCaption?: JSX.Element;
}

export const LeverageSlider = ({
  inputLabel,
  errorMsg,
  infoMsg,
  cashBorrowed,
  rightCaption,
  bottomCaption,
  context,
}: LeverageSliderProps) => {
  const {
    state: {
      riskFactorLimit,
      debtBalance,
      collateralBalance,
      depositBalance,
      deposit,
      maxLeverageRatio,
      defaultLeverageRatio,
    },
    updateState,
  } = useContext(context);
  const { sliderInputRef, setSliderInput } = useSliderInputRef();

  // Sets the initial default leverage ratio
  useEffect(() => {
    if (!riskFactorLimit && defaultLeverageRatio !== undefined) {
      updateState({
        riskFactorLimit: {
          riskFactor: 'leverageRatio',
          limit: defaultLeverageRatio,
        },
      });
      setSliderInput(defaultLeverageRatio);
    }
  }, [riskFactorLimit, defaultLeverageRatio, setSliderInput, updateState]);

  const zeroUnderlying = deposit ? TokenBalance.zero(deposit) : undefined;
  let totalAssetValue: TokenBalance | undefined = undefined;

  if (zeroUnderlying) {
    try {
      totalAssetValue = (depositBalance?.toUnderlying() || zeroUnderlying).add(
        collateralBalance?.toUnderlying() || zeroUnderlying
      );
    } catch {
      // Suppress race condition errors
    }
  }

  return defaultLeverageRatio && maxLeverageRatio ? (
    <SliderInput
      ref={sliderInputRef}
      min={0}
      max={maxLeverageRatio}
      onChangeCommitted={(leverageRatio) =>
        updateState({
          riskFactorLimit: {
            riskFactor: 'leverageRatio',
            limit: leverageRatio,
          },
        })
      }
      infoMsg={infoMsg}
      errorMsg={errorMsg}
      rightCaption={rightCaption}
      bottomCaption={bottomCaption}
      inputLabel={inputLabel}
      sliderLeverageInfo={{
        debtHeading: defineMessage({ defaultMessage: 'Borrow Amount' }),
        assetHeading: defineMessage({ defaultMessage: 'Asset Amount' }),
        debtValue: cashBorrowed
          ? cashBorrowed.toUnderlying().abs().toFloat()
          : debtBalance?.toUnderlying().abs().toFloat(),
        debtSuffix: ` ${zeroUnderlying?.symbol || ''}`,
        assetValue: totalAssetValue?.toFloat(),
        assetSuffix: ` ${zeroUnderlying?.symbol || ''}`,
      }}
    />
  ) : (
    <PageLoading />
  );
};
