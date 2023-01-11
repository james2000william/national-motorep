import { useAccountWithdrawableTokens } from '@notional-finance/notionable-hooks';
import { PORTFOLIO_ACTIONS } from '@notional-finance/shared-config';
import { FormattedMessage } from 'react-intl';
import { useLocation, useHistory } from 'react-router-dom';
import { ButtonOptionsType } from '@notional-finance/mui';
import { getNowSeconds } from '@notional-finance/sdk';
import { ethers } from 'ethers';
import { useAccount } from '@notional-finance/notionable-hooks';

export const useClaimNote = async () => {
  const { account } = useAccount();
  let userNoteEarnedPerSecond = 0;
  let userNoteEarnedFloat = 0;
  let userNoteEarned;

  if (account) {
    const nowInSeconds = getNowSeconds();
    userNoteEarned = await account!.fetchClaimableIncentives(account?.address);

    const userNoteEarnedPlus100 = await account!.fetchClaimableIncentives(
      account?.address,
      nowInSeconds + 100
    );
    if (userNoteEarned) {
      const perSecond = userNoteEarnedPlus100.sub(userNoteEarned).div(100);
      userNoteEarnedPerSecond = parseFloat(
        ethers.utils.formatUnits(perSecond, 8)
      );
      userNoteEarnedFloat = parseFloat(
        ethers.utils.formatUnits(userNoteEarned, 8)
      );
    }
  }

  return { userNoteEarnedPerSecond, userNoteEarnedFloat, userNoteEarned };
};

export const usePortfolioButtonBar = () => {
  const { accountSummariesLoaded } = useAccount();
  const { pathname: currentPath } = useLocation();
  const withdrawableTokens = useAccountWithdrawableTokens();
  const history = useHistory();

  const buttonData: ButtonOptionsType[] = [
    {
      buttonText: <FormattedMessage defaultMessage={'Deposit Collateral'} />,
      callback: () => {
        history.push(`${currentPath}/${PORTFOLIO_ACTIONS.DEPOSIT}`);
      },
    },
  ];

  if (withdrawableTokens.length > 0) {
    buttonData.push({
      buttonText: <FormattedMessage defaultMessage={'Withdraw'} />,
      callback: () => {
        history.push(`${currentPath}/${PORTFOLIO_ACTIONS.WITHDRAW}`);
      },
    });
  }

  return !accountSummariesLoaded ? [] : buttonData;
};
