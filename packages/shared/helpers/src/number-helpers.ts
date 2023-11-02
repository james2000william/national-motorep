import { RATE_PRECISION } from '@notional-finance/util';

const allCommas = /,{1}/g;

export function convertRateToFloat(rate: number) {
  return (rate / RATE_PRECISION) * 100;
}

export function convertFloatToRate(rate: number) {
  return (rate * RATE_PRECISION) / 100;
}

export function formatLeverageRatio(ratio: number, decimals = 3) {
  return `${formatNumber(ratio, decimals)}x`;
}

export function formatNumber(num: string | number, decimals = 4) {
  const cleanedNumber =
    typeof num === 'string' ? num.replace(allCommas, '') : num;

  return parseFloat(`${cleanedNumber}`).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatNumberToDigits(num: string | number, digits = 3) {
  const cleanedNumber =
    typeof num === 'string' ? num.replace(allCommas, '') : num;

  return parseFloat(`${cleanedNumber}`).toLocaleString('en-US', {
    minimumSignificantDigits: digits,
    maximumSignificantDigits: digits,
  });
}

export function formatNumberAsPercentWithUndefined(
  num: number | string | undefined,
  defaultValue: string,
  decimals = 2
) {
  return num === undefined ? defaultValue : `${formatNumber(num, decimals)}%`;
}

export function formatNumberAsPercent(num: number | string, decimals = 2) {
  return `${formatNumber(num, decimals)}%`;
}

export function formatNumberAsAPY(num: number | string, decimals = 2) {
  return `${formatNumberAsPercent(num, decimals)} APY`;
}

export function formatNumberAsAbbr(
  num: number,
  decimalPlaces = 3,
  locale = 'en-US'
) {
  let suffix = '';

  if (Math.abs(num) < 1_000) {
    suffix = '';
  } else if (Math.abs(num) < 1_000_000) {
    suffix = 'k';
    num = num / 1_000;
  } else if (Math.abs(num) < 1_000_000_000) {
    suffix = 'm';
    num = num / 1_000_000;
  } else if (Math.abs(num) < 1_000_000_000_000) {
    suffix = 'b';
    num = num / 1_000_000_000;
  }

  const localeString = num.toLocaleString(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  // If the return string is -0.00 or some variant, strip the negative
  if (localeString.match(/-0\.?[0]*$/)) {
    return localeString.replace('-', '');
  }

  return `$${localeString}${suffix}`;
}
