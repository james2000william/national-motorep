import { SvgIcon, SvgIconProps } from '@mui/material';

/* eslint-disable-next-line */
export interface ExternalLinkIconProps extends SvgIconProps {}

export function ExternalLinkIcon(props: ExternalLinkIconProps) {
  return (
    <SvgIcon viewBox="0 0 13.3 13.3" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.3907 1.66634H9.00016C8.63197 1.66634 8.3335 1.36786 8.3335 0.999674C8.3335 0.631485 8.63197 0.333008 9.00016 0.333008H13.0002C13.3684 0.333008 13.6668 0.631485 13.6668 0.999674V4.99967C13.6668 5.36786 13.3684 5.66634 13.0002 5.66634C12.632 5.66634 12.3335 5.36786 12.3335 4.99967V2.60915L6.13823 8.80441C5.87788 9.06476 5.45577 9.06476 5.19542 8.80441C4.93508 8.54406 4.93508 8.12195 5.19542 7.8616L11.3907 1.66634ZM10.3335 7.66634C10.3335 7.29815 10.632 6.99967 11.0002 6.99967C11.3684 6.99967 11.6668 7.29815 11.6668 7.66634V11.6663C11.6668 12.7709 10.7714 13.6663 9.66683 13.6663H2.3335C1.22893 13.6663 0.333496 12.7709 0.333496 11.6663V4.33301C0.333496 3.22844 1.22893 2.33301 2.3335 2.33301H6.3335C6.70169 2.33301 7.00016 2.63148 7.00016 2.99967C7.00016 3.36786 6.70169 3.66634 6.3335 3.66634H2.3335C1.96531 3.66634 1.66683 3.96482 1.66683 4.33301V11.6663C1.66683 12.0345 1.96531 12.333 2.3335 12.333H9.66683C10.035 12.333 10.3335 12.0345 10.3335 11.6663V7.66634Z"
      />
    </SvgIcon>
  );
}

export default ExternalLinkIcon;
