import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelectedNetwork } from '@notional-finance/notionable-hooks';
import { getContractUrls } from '@notional-finance/helpers';
import {
  getEtherscanAddressLink,
  NotionalAddress,
} from '@notional-finance/util';
import { RiskFaq } from '../components';

interface FaqProps {
  question: ReactNode;
  answer?: ReactNode;
  componentAnswer?: ReactNode;
}

export const useLendVariableFaq = (tokenSymbol?: string) => {
  const selectedNetwork = useSelectedNetwork();
  const faqHeaderLinks = [
    {
      href: 'https://docs.notional.finance/notional-v3/product-guides/variable-rate-lending',
      text: (
        <FormattedMessage defaultMessage={'Variable Lending Documentation'} />
      ),
    },
    {
      href:
        tokenSymbol && getContractUrls(tokenSymbol)
          ? getContractUrls(tokenSymbol).prime
          : '',
      text: (
        <FormattedMessage
          defaultMessage={'Prime {tokenSymbol} Contract'}
          values={{
            tokenSymbol,
          }}
        />
      ),
    },
    {
      href: selectedNetwork
        ? getEtherscanAddressLink(
            NotionalAddress[selectedNetwork],
            selectedNetwork
          )
        : '',
      text: <FormattedMessage defaultMessage={'Notional Contract'} />,
    },
  ];
  const faqs: FaqProps[] = [
    {
      question: (
        <FormattedMessage
          defaultMessage={
            'What is Prime {tokenSymbol} and Prime {tokenSymbol} Debt?'
          }
          description={'faq question'}
          values={{
            tokenSymbol,
          }}
        />
      ),
      answer: (
        <FormattedMessage
          defaultMessage={`Prime {tokenSymbol} is {tokenSymbol} that is being lent on Notional’s variable rate {tokenSymbol} lending market. Prime {tokenSymbol} debt is {tokenSymbol} that is being borrowed form the variable rate {tokenSymbol} lending market.`}
          description={'faq answer'}
          values={{
            tokenSymbol,
          }}
        />
      ),
    },

    {
      question: (
        <FormattedMessage
          defaultMessage={'Where does the yield come from?'}
          description={'faq question'}
        />
      ),
      answer: (
        <FormattedMessage
          defaultMessage={`Lenders earn yield by lending their funds to over-collateralized borrowers. Any funds that aren’t being utilized by borrowers on Notional can be deposited on external money markets to generate additional yield.`}
        />
      ),
    },
    {
      question: (
        <FormattedMessage
          defaultMessage={'Why is the Prime {tokenSymbol} debt APY so high?'}
          description={'faq question'}
          values={{
            tokenSymbol,
          }}
        />
      ),
      answer: (
        <FormattedMessage
          defaultMessage={`Variable rate borrowers on Notional are willing to pay high rates to use Notional’s leveraged vaults. Leveraged vaults allow advanced DeFi users to get Leverage for whitelisted, over-collateralized DeFi yield strategies. This pushes the borrowing rate up and drives high returns for lenders.`}
          description={'faq answer'}
        />
      ),
    },
    {
      question: (
        <FormattedMessage
          defaultMessage={'What are the risks?'}
          description={'faq question'}
        />
      ),

      componentAnswer: <RiskFaq />,
    },
  ];

  return { faqs, faqHeaderLinks };
};

export default useLendVariableFaq;
