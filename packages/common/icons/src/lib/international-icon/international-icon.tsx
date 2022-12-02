import { SvgIcon, SvgIconProps, useTheme } from '@mui/material';
import React from 'react';

/* eslint-disable-next-line */
export interface InternationalIconProps extends SvgIconProps {}

export const InternationalIcon = (props: InternationalIconProps) => {
  const theme = useTheme();
  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 46 46">
        <path
          d="M45.9962 22.9971V22.9856C45.9962 16.1798 43.0332 10.0679 38.3282 5.86479L38.3052 5.84562C38.2471 5.78298 38.1822 5.72705 38.1117 5.67888L38.1078 5.67696C33.9291 2.00772 28.5552 -0.0107936 22.9942 4.34107e-05C17.1834 4.34107e-05 11.8785 2.15812 7.83468 5.71913L7.8596 5.69805C7.81086 5.73502 7.76592 5.77675 7.72544 5.82262V5.82454C5.29441 7.97723 3.34851 10.6219 2.01666 13.5834C0.684817 16.5449 -0.00258132 19.7557 7.284e-06 23.0029C7.284e-06 29.8067 2.95909 35.9187 7.66028 40.1237L7.68328 40.1429C7.74416 40.2119 7.81226 40.2743 7.88643 40.3288L7.89026 40.3307C12.0679 43.9945 17.4377 46.0101 22.9942 46C28.5768 46.0085 33.9695 43.9743 38.1557 40.2809L38.1308 40.302C40.604 38.1517 42.5865 35.4952 43.9441 32.5123C45.3017 29.5295 46.0028 26.2898 46 23.0125V22.999L45.9962 22.9971ZM37.4447 37.9561C36.3055 37.0345 35.0803 36.2245 33.7861 35.5373L33.6615 35.476C34.8363 32.0894 35.5435 28.1853 35.6106 24.1241V24.0934H43.7768C43.5015 29.3475 41.2401 34.3007 37.4505 37.9503L37.4447 37.9561ZM24.0943 35.0716C26.5532 35.2038 28.8511 35.7443 30.9707 36.624L30.8328 36.5742C29.1347 40.4457 26.7449 43.1059 24.0943 43.6905V35.0716ZM24.0943 32.879V24.0934H33.4239C33.3499 27.7316 32.719 31.337 31.5534 34.7841L31.6281 34.533C29.2487 33.555 26.718 32.9961 24.148 32.8809L24.0962 32.879H24.0943ZM24.0943 21.9008V13.1152C26.7337 12.9948 29.3321 12.417 31.7738 11.4075L31.6224 11.4631C32.686 14.5661 33.3396 18.1424 33.4239 21.8606V21.9008H24.0943ZM24.0943 10.9227V2.30761C26.7449 2.89217 29.1347 5.54089 30.8328 9.42388C28.8511 10.248 26.5532 10.7866 24.1499 10.9207L24.0943 10.9227ZM29.564 3.25632C31.8224 4.0096 33.9344 5.14542 35.808 6.61417L35.7639 6.57967C34.9149 7.24665 33.9624 7.87528 32.9582 8.42151L32.8508 8.47517C32.0393 6.55998 30.9236 4.78857 29.5468 3.22949L29.564 3.25057V3.25632ZM21.898 2.31336V10.9227C19.534 10.802 17.2081 10.277 15.0216 9.37022L15.1596 9.42005C16.8653 5.54855 19.2513 2.89025 21.9018 2.30569L21.898 2.31336ZM13.1434 8.46943C12.1045 7.91047 11.1146 7.26484 10.1843 6.53943L10.2303 6.57392C12.0493 5.14828 14.0954 4.03905 16.2826 3.29273L16.4283 3.24865C15.0875 4.7655 13.9951 6.48483 13.1913 8.34293L13.1434 8.46751V8.46943ZM21.9018 13.1133V21.8989H12.5723C12.6566 18.1405 13.3101 14.5642 14.4485 11.2101L14.3738 11.4612C16.7523 12.4377 19.2816 12.9959 21.8501 13.1114L21.9018 13.1133ZM21.9018 24.0915V32.8771C19.2625 32.9976 16.6641 33.5754 14.2224 34.5848L14.3738 34.5292C13.3101 31.4282 12.6566 27.8499 12.5723 24.1317V24.0915H21.9018ZM21.9018 35.0697V43.6847C19.2513 43.1002 16.8614 40.4515 15.1634 36.5685C17.1451 35.7443 19.443 35.2077 21.8463 35.0735L21.9018 35.0716V35.0697ZM16.4398 42.736C14.1821 41.9849 12.07 40.8517 10.1958 39.3858L10.2418 39.4203C11.0908 38.7534 12.0433 38.1247 13.0476 37.5785L13.1549 37.5248C13.9596 39.4408 15.0754 41.2106 16.457 42.7629L16.4398 42.7437V42.736ZM32.8528 37.5229C33.9643 38.1266 34.9168 38.7534 35.8118 39.4529L35.7659 39.4184C33.9468 40.8441 31.9008 41.9533 29.7135 42.6996L29.5679 42.7437C30.9086 41.2275 32.0011 39.5088 32.8048 37.6513L32.8528 37.5267V37.5229ZM43.7768 21.9008H35.6106C35.5519 17.9353 34.8676 14.004 33.5829 10.2518L33.6615 10.5163C35.0153 9.80349 36.2971 8.96138 37.4888 8.00178L37.4428 8.03628C41.2246 11.6721 43.4868 16.6069 43.773 21.8453L43.7749 21.8989L43.7768 21.9008ZM8.55146 8.03819C9.65537 8.93515 10.8953 9.75737 12.2101 10.4569L12.3346 10.5183C11.1598 13.9049 10.4526 17.8089 10.3856 21.8702V21.9008H2.21741C2.49279 16.6467 4.75419 11.6935 8.54379 8.04394L8.54954 8.03819H8.55146ZM2.21932 24.0934H10.3856C10.4443 28.0589 11.1286 31.9903 12.4132 35.7424L12.3346 35.4779C10.8953 36.2426 9.65728 37.0648 8.50738 37.9925L8.55337 37.958C4.7716 34.3222 2.50941 29.3873 2.22315 24.149L2.22124 24.0953L2.21932 24.0934Z"
          fill={theme.palette.common.black}
        />
      </svg>
    </SvgIcon>
  );
};