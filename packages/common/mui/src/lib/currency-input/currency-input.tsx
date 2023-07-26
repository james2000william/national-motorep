import * as React from 'react';
import NumberFormat from 'react-number-format';
import { Input, Box, useTheme, Divider, styled } from '@mui/material';
import { NotionalTheme } from '@notional-finance/styles';
import CurrencySelect, { CurrencySelectProps } from './currency-select';
import ErrorMessage from '../error-message/error-message';
import MaxButton from '../max-button/max-button';
import { Paragraph } from '../typography/typography';
import { useCallback, useRef } from 'react';

export interface CurrencyInputStyleProps {
  landingPage: boolean;
}

export interface CurrencyInputProps extends CurrencySelectProps {
  placeholder: string;
  decimals: number;
  onInputChange: (value: string) => void;
  errorMsg?: React.ReactNode;
  captionMsg?: React.ReactNode;
  warningMsg?: React.ReactNode;
  maxValue?: string;
  style?: CurrencyInputStyleProps;
  onMaxValue?: () => void;
  ref: React.RefObject<HTMLDivElement>;
}

export interface CurrencyInputHandle {
  setInputOverride: (input: string) => void;
}

const NumberFormatter = React.forwardRef<
  NumberFormat<string>,
  { decimals: number }
>((props, ref) => {
  const { decimals } = props;
  return (
    <NumberFormat
      {...props}
      type="text"
      getInputRef={ref}
      allowNegative={false}
      thousandSeparator
      isNumericString
      decimalScale={decimals}
    />
  );
});

const Container = styled(Box)``;

const InputContainer = styled(Box)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  padding-top: ${theme.spacing(1)};
  padding-bottom: ${theme.spacing(1)};
  padding-left: ${theme.spacing(2)};
  border-style: solid;
`
);

export const useCurrencyInputRef = () => {
  const currencyInputRef = useRef<CurrencyInputHandle>(null);
  const isInputRefDefined = !!currencyInputRef.current;
  const setCurrencyInput = useCallback(
    (input: string) => {
      currencyInputRef.current?.setInputOverride(input);
    },
    // isInputRefDefined must be in the dependencies otherwise the useCallback will not
    // properly trigger to generate a new function when the input ref becomes defined
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currencyInputRef, isInputRefDefined]
  );

  return { setCurrencyInput, currencyInputRef };
};

export const CurrencyInput = React.forwardRef<
  CurrencyInputHandle,
  CurrencyInputProps
>((props, ref) => {
  const {
    decimals,
    errorMsg,
    placeholder,
    warningMsg,
    captionMsg,
    maxValue,
    onInputChange,
    onMaxValue,
    style,
  } = props;
  const theme = useTheme() as NotionalTheme;
  const [hasFocus, setHasFocus] = React.useState(false);
  const [value, setValue] = React.useState('');

  const inputContainerRef = React.useRef(null);

  // This imperative handle allows parent components to override the input
  // string directly without doing weird useEffect roundabout logic
  React.useImperativeHandle(ref, () => ({
    setInputOverride: (input: string) => {
      setValue(input);
      onInputChange(input);
    },
  }));

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setValue(value);
    onInputChange(value);
  };

  const getBorderColor = () => {
    if (errorMsg) return theme.palette.error.main;
    if (warningMsg) return theme.palette.warning.main;
    if (hasFocus) return theme.palette.info.main;
    return theme.palette.borders.paper;
  };

  const currentErrorMessage = errorMsg || warningMsg;
  const errorType = errorMsg ? 'error' : 'warning';

  const borderColor = getBorderColor();

  const CustomSelect = React.forwardRef((props: CurrencySelectProps, ref) => {
    return <CurrencySelect {...{ ...props, popperRef: ref }} />;
  });

  return (
    <Container>
      <InputContainer
        ref={inputContainerRef}
        theme={theme}
        borderColor={borderColor}
        sx={{
          background: theme.palette.common.white,
          width: '100%',
          borderColor: borderColor,
          borderTopWidth: style?.landingPage ? '0px' : '1px',
          borderLeftWidth: style?.landingPage ? '0px' : '1px',
          borderRightWidth: style?.landingPage ? '0px' : '1px',
          borderBottomWidth: style?.landingPage ? '2px' : '1px',
          borderRadius: style?.landingPage ? '0px' : theme.shape.borderRadius(),
        }}
      >
        <Input
          disableUnderline
          inputRef={ref}
          name="input-field"
          autoComplete="off"
          value={value}
          error={!!errorMsg}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={() => {
            setHasFocus(true);
          }}
          onBlur={() => {
            setHasFocus(false);
          }}
          sx={{
            width: {
              xs: '100%',
              sm: '100%',
              md: '265px',
              lg: '265px',
              xl: '265px',
            },
            marginBottom: theme.spacing(0),
            fontSize: theme.typography.h4.fontSize,
            color: style?.landingPage
              ? theme.palette.common.white
              : theme.palette.common.black,
          }}
          inputComponent={NumberFormatter as any}
          inputProps={{ decimals }}
        />
        <MaxButton
          isVisible={!!maxValue || !!onMaxValue}
          onClick={() => {
            if (maxValue) {
              setValue(maxValue);
              onInputChange(maxValue);
            } else if (onMaxValue) {
              onMaxValue();
            }
          }}
        />
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            marginTop: '-0.5rem',
            marginBottom: '-0.5rem',
            marginLeft: '0.5rem',
            borderRightWidth: style?.landingPage ? '0px' : '1px',
            borderColor: borderColor,
          }}
        />
        <CustomSelect
          {...{
            ...props,
            landingPage: style?.landingPage,
            ref: inputContainerRef,
          }}
        />
      </InputContainer>
      <ErrorMessage variant={errorType} message={currentErrorMessage} />
      <Paragraph marginTop={theme.spacing(1)}>
        {captionMsg || '\u00A0'}
      </Paragraph>
    </Container>
  );
});

export default CurrencyInput;
