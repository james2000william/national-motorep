import { SvgIcon, SvgIconProps } from '@mui/material';

/* eslint-disable-next-line */
export interface CheckmarkIconProps extends SvgIconProps {}

export function CheckmarkIcon(props: CheckmarkIconProps) {
  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="4 4 16 16">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.6845 6.29508C16.411 5.04218 14.6744 4.13098 12.8221 4.01708C10.9697 3.90319 9.11733 4.35878 7.61228 5.38388C5.99146 6.40898 4.9495 7.88968 4.37063 9.71208C3.79177 11.4206 3.90754 13.3569 4.60218 15.0654C5.29682 16.7739 6.57032 18.1407 8.19115 19.0519C9.81197 19.9631 11.6643 20.1909 13.5167 19.8492C15.3691 19.5075 16.9899 18.4824 18.1476 17.1156C19.3054 15.6349 20 13.9264 20 12.104C20 9.82598 19.1896 7.88968 17.6845 6.29508ZM17.3372 16.3183C16.2953 17.5712 14.906 18.3685 13.4009 18.7102C11.8959 19.0519 10.2751 18.8241 8.88579 18.0268C7.49651 17.2295 6.45455 16.0905 5.75991 14.6098C5.06527 13.1291 5.06527 11.5345 5.52837 10.0538C5.99146 8.45918 6.91764 7.20628 8.19115 6.29508C9.46465 5.38388 11.0855 5.04218 12.5905 5.15608C14.2113 5.26998 15.6006 5.95338 16.7584 7.09238C18.0319 8.34528 18.7265 10.1677 18.7265 11.9901C18.8423 13.5847 18.2634 15.0654 17.3372 16.3183ZM10.9465 15.2584H10.1246L7.49651 12.6729L8.3185 11.8642L10.5413 14.051L15.4038 9.25586L16.2258 10.0645L10.9465 15.2584Z"
        />
      </svg>
    </SvgIcon>
  );
}

export default CheckmarkIcon;
