import { PRODUCTS } from '@notional-finance/shared-config';
import { CardContainer } from '@notional-finance/shared-web';
import { CurrencyFixed, FeatureLoader } from '@notional-finance/mui';
import { useAllMarkets } from '@notional-finance/notionable-hooks';
import { useNotionalTheme } from '@notional-finance/styles';
import { useUserSettingsState } from '@notional-finance/user-settings-manager';
import { defineMessage, FormattedMessage } from 'react-intl';
import { ThemeProvider } from '@mui/material';
import { groupArrayToMap } from '@notional-finance/util';
import {
  formatMaturity,
  formatNumberAsPercent,
} from '@notional-finance/helpers';

export const BorrowFixedCardView = () => {
  const { themeVariant } = useUserSettingsState();
  const themeLanding = useNotionalTheme(themeVariant, 'landing');
  const {
    yields: { fCashBorrow },
    getMin,
  } = useAllMarkets();

  const cardData = [
    ...groupArrayToMap(fCashBorrow, (t) => t.underlying.symbol).entries(),
  ];

  return (
    <ThemeProvider theme={themeLanding}>
      <FeatureLoader
        featureLoaded={cardData?.length > 0 && themeVariant ? true : false}
      >
        <CardContainer
          heading={defineMessage({
            defaultMessage: 'Fixed Rate Borrowing',
            description: 'page heading',
          })}
          subtitle={defineMessage({
            defaultMessage: `Fix your rate and never worry about spiking borrowing costs again.`,
            description: 'page heading subtitle',
          })}
          linkText={defineMessage({
            defaultMessage: 'Read fixed borrow docs',
            description: 'docs link',
          })}
          docsLink="https://docs.notional.finance/notional-v2/what-you-can-do/fixed-rate-borrowing"
        >
          {cardData.map(([symbol, yields], index) => {
            // Special handling for borrowing ETH, default to collateralized by USDC
            const route =
              symbol === 'ETH'
                ? `/${PRODUCTS.BORROW_FIXED}/${symbol}/USDC`
                : `/${PRODUCTS.BORROW_FIXED}/${symbol}/ETH`;
            const minRate = getMin(yields)?.totalAPY || 0;
            const allRates = yields
              .sort((a, b) => (a.token.maturity || 0) - (b.token.maturity || 0))
              .map((y) => ({
                maturity: formatMaturity(y.token.maturity || 0),
                rate: formatNumberAsPercent(y.totalAPY),
              }));

            return (
              <CurrencyFixed
                key={index}
                symbol={symbol}
                rate={minRate}
                allRates={allRates}
                route={route}
                apyTagline={<FormattedMessage defaultMessage={'AS LOW AS'} />}
                buttonText={
                  <FormattedMessage
                    defaultMessage="Borrow {symbol}"
                    values={{
                      symbol,
                    }}
                  />
                }
              />
            );
          })}
        </CardContainer>
      </FeatureLoader>
    </ThemeProvider>
  );
};

export default BorrowFixedCardView;