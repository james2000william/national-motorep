import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

/* eslint-disable-next-line */
export interface JapaneseFlagIconProps extends SvgIconProps {}

export const JapaneseFlagIcon = (props: JapaneseFlagIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 46 46">
        <path
          d="M23 46C35.7025 46 46 35.7025 46 23C46 10.2975 35.7025 0 23 0C10.2975 0 0 10.2975 0 23C0 35.7025 10.2975 46 23 46Z"
          fill="white"
        />
        <path
          d="M33.0449 23.0313C33.0449 28.5617 28.5617 33.0449 23.0313 33.0449C17.5009 33.0449 13.0177 28.5617 13.0177 23.0313C13.0177 17.5009 17.5009 13.0177 23.0313 13.0177C28.5617 13.0177 33.0449 17.5009 33.0449 23.0313Z"
          fill="#BD0F2A"
        />
      </svg>
    </SvgIcon>
  );
};
