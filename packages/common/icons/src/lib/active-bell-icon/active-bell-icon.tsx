import { SvgIcon, SvgIconProps, useTheme } from '@mui/material';

/* eslint-disable-next-line */
export interface ActiveBellIconProps extends SvgIconProps {}

export function ActiveBellIcon(props: ActiveBellIconProps) {
  const theme = useTheme();

  return (
    <SvgIcon {...props}>
      <svg
        width="22"
        height="21"
        viewBox="0 0 22 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.7946 16.7379C17.2122 16.2187 16.7022 15.6234 16.2785 14.9681C15.816 14.0636 15.5387 13.0758 15.4631 12.0628V9.07886C15.4671 7.48762 14.8899 5.94968 13.8399 4.75401C12.7899 3.55834 11.3395 2.78723 9.76107 2.58557V1.80638C9.76107 1.59251 9.67612 1.38741 9.52489 1.23618C9.37367 1.08496 9.16856 1 8.9547 1C8.74083 1 8.53573 1.08496 8.3845 1.23618C8.23328 1.38741 8.14832 1.59251 8.14832 1.80638V2.59765C6.58405 2.81385 5.15112 3.58962 4.11495 4.78127C3.07878 5.97293 2.50957 7.49972 2.51275 9.07886V12.0628C2.4371 13.0758 2.15987 14.0636 1.69732 14.9681C1.28107 15.6219 0.779312 16.2171 0.205369 16.7379C0.140938 16.7945 0.0893001 16.8642 0.0538897 16.9423C0.0184793 17.0204 0.000108602 17.1052 0 17.1909V18.0124C0 18.1726 0.0636383 18.3263 0.176915 18.4395C0.290192 18.5528 0.443829 18.6164 0.604027 18.6164H17.396C17.5562 18.6164 17.7098 18.5528 17.8231 18.4395C17.9364 18.3263 18 18.1726 18 18.0124V17.1909C17.9999 17.1052 17.9815 17.0204 17.9461 16.9423C17.9107 16.8642 17.8591 16.7945 17.7946 16.7379ZM1.25638 17.4084C1.81837 16.8655 2.31318 16.2571 2.7302 15.5963C3.31285 14.5039 3.65281 13.2986 3.72685 12.0628V9.07886C3.70289 8.37096 3.82163 7.66548 4.076 7.00443C4.33037 6.34338 4.71516 5.74027 5.20746 5.23103C5.69977 4.72178 6.28952 4.31681 6.94159 4.04023C7.59366 3.76365 8.29472 3.62112 9.00302 3.62112C9.71132 3.62112 10.4124 3.76365 11.0645 4.04023C11.7165 4.31681 12.3063 4.72178 12.7986 5.23103C13.2909 5.74027 13.6757 6.34338 13.93 7.00443C14.1844 7.66548 14.3032 8.37096 14.2792 9.07886V12.0628C14.3532 13.2986 14.6932 14.5039 15.2758 15.5963C15.6929 16.2571 16.1877 16.8655 16.7497 17.4084H1.25638Z"
          fill={theme.palette.common.black}
        />
        <path
          d="M9.03041 20.634C9.41091 20.6253 9.77605 20.4822 10.0612 20.2302C10.3464 19.9781 10.5333 19.6334 10.5888 19.2568H7.41162C7.46869 19.6436 7.6643 19.9965 7.96207 20.2498C8.25984 20.5031 8.6395 20.6397 9.03041 20.634Z"
          fill={theme.palette.common.black}
        />
        <circle cx="16" cy="6" r="6" fill="#FF3D71" />
        <path
          d="M16.2985 7.78886H15.1903V2H16.2985V7.78886ZM16.5 9.48739C16.5 9.68767 16.4291 9.86485 16.2873 10.0189C16.1455 10.173 15.9664 10.25 15.75 10.25C15.541 10.25 15.3619 10.1768 15.2127 10.0305C15.0709 9.8764 15 9.69923 15 9.49895C15 9.29097 15.0709 9.11379 15.2127 8.96744C15.3545 8.81337 15.5336 8.73634 15.75 8.73634C15.9664 8.73634 16.1455 8.80952 16.2873 8.95588C16.4291 9.10224 16.5 9.27941 16.5 9.48739Z"
          fill="white"
        />
      </svg>
    </SvgIcon>
  );
}

export default ActiveBellIcon;
