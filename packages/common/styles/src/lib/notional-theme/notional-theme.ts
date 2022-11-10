import {
  PaletteOptions,
  PaletteMode,
  createTheme,
  Theme,
  ThemeOptions,
  GradientOptions,
  ShapeOptions,
  alpha,
} from '@mui/material';
import { THEME_VARIANTS } from '@notional-finance/shared-config';
import { NotionalFonts } from './fonts';
import { NormalizeCss } from './normalize';
import React from 'react';
import { CommonColors } from '@mui/material/styles/createPalette';

const colors = {
  // primaries
  green: '#1F9B99',
  aqua: '#13BBC2',
  // darks
  black: '#012E3A',
  matteGreen: '#1C4E5C',
  darkGreen: '#013D4A',
  // lights
  white: '#FFFFFF',
  iceWhite: '#F8FAFA',
  // greys
  darkGrey: '#6E7C90',
  purpleGrey: '#E7E8F2',
  lightGrey: '#E6EAEB',
  secondaryGrey: '#8F9BB3',
  greenGrey: '#95B2BA',
  blueGreen: '#3B7A8B',
  // accents
  red: '#FF3D71',
  orange: '#FFAA00',
  turquoise: '#2DE1E8',
  purple: '#C5B6DD',
  neonTurquoise: '#33F8FF',
  yellow: '#f8ff33',
  greenAccent: '#33ff3a',
};

const fontColor = {
  primary: colors.black,
  secondary: colors.darkGrey,
  accent: colors.aqua,
};

const lineHeight = 1.4;
const pxToRem = (px: number) => `${(px / 16).toFixed(3)}rem`;
const pxToMargin = (px: number) => `${(px / lineHeight / 16).toFixed(3)}rem`;
const fontWeight = {
  light: 300,
  medium: 500,
  demiBold: 600,
  bold: 700,
};

declare module '@mui/material/styles' {
  interface Theme {
    shape: Shape;
    gradient: Gradient;
  }

  interface ThemeOptions {
    shape: ShapeOptions;
    gradient?: GradientOptions;
  }

  interface Palette {
    common: CommonColors;
    typography: PaletteColor;
    background: TypeBackground;
    borders: TypeBackground;
    charts: PaletteColor;
    primary: PaletteColor;
    error: PaletteColor;
    warning: PaletteColor;
    info: PaletteColor;
    success: PaletteColor;
  }

  interface PaletteOptions {
    common?: Partial<CommonColors>;
    typography: PaletteColorOptions;
    background?: Partial<TypeBackground>;
    borders: TypeBackground;
    charts: PaletteColor;
    primary?: PaletteColorOptions;
    error?: PaletteColorOptions;
    warning?: PaletteColorOptions;
    info?: PaletteColorOptions;
    success?: PaletteColorOptions;
  }

  interface PaletteColor {
    accent: string;
  }

  interface SimplePaletteColorOptions {
    accent?: string;
  }

  type PaletteColorOptions = SimplePaletteColorOptions;

  interface TypeBackground {
    accentPaper: string;
    accentDefault: string;
  }

  interface TypographyVariants {
    labelValue: React.CSSProperties;
    tableCell: React.CSSProperties;
    largeNumber: React.CSSProperties;
    largeNumberLabel: React.CSSProperties;
    largeInput: React.CSSProperties;
    largeInputEmphasized: React.CSSProperties;
    link: React.CSSProperties;
    captionAccent: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    labelValue?: React.CSSProperties;
    tableCell?: React.CSSProperties;
    largeNumber?: React.CSSProperties;
    largeNumberLabel?: React.CSSProperties;
    largeInput?: React.CSSProperties;
    largeInputEmphasized?: React.CSSProperties;
    link?: React.CSSProperties;
    captionAccent?: React.CSSProperties;
  }

  interface Shape {
    borderStandard: string;
    borderHighlight: string;
    // NOTE: this has to be a function to silence a mui error
    borderRadius: () => string;
    borderRadiusLarge: string;
    shadowStandard: string;
    shadowLandingPage: string;
    shadowAccent: string;
    shadowLarge: (color?: string) => string;
  }

  interface ShapeOptions {
    borderRadius: () => string;
    borderRadiusLarge?: string;
    borderStandard?: string;
    borderHighlight?: string;
    shadowStandard?: string;
    shadowLandingPage?: string;
    shadowAccent?: string;
    shadowLarge?: (color?: string) => string;
  }

  interface Gradient {
    lightGreen: string;
    darkGreen: string;
    darkBlue: string;
    green: string;
    landing: string;
    landingVertical: string;
    aqua: string;
    hoverTransition: (start: string, end: string, zIndex?: number) => string;
  }

  interface GradientOptions {
    lightGreen?: string;
    darkGreen?: string;
    darkBlue?: string;
    green?: string;
    landing?: string;
    landingVertical?: string;
    aqua?: string;
    hoverTransition?: (start: string, end: string, zIndex?: number) => string;
  }

  interface ButtonPropsVariantOverrides {
    text: false;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h6: false;
    subtitle: false;
    overline: false;
    tableCell: true;
    largeNumber: true;
    labelValue: true;
    largeNumberLabel: true;
    largeInput: true;
    largeInputEmphasized: true;
    link: true;
    captionAccent: true;
  }
}

export type NotionalTheme = Theme;

function getFontColors(themeVariant: PaletteMode) {
  if (themeVariant === 'dark') {
    return {
      primary: colors.purpleGrey,
      secondary: colors.greenGrey,
      accent: colors.neonTurquoise,
    };
  } else {
    return {
      primary: fontColor.primary,
      secondary: fontColor.secondary,
      accent: fontColor.accent,
    };
  }
}

const getThemeData = (themeVariant: PaletteMode) => {
  const theme: ThemeOptions = {
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          ${NormalizeCss}
          ${NotionalFonts}
        `,
      },
      MuiButton: {
        variants: [
          {
            props: { variant: 'outlined' },
            style: {
              backgroundColor: 'transparent',
            },
          },
        ],
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1400,
        xl: 1536,
      },
    },
    palette: {
      common: {
        black:
          themeVariant === THEME_VARIANTS.LIGHT
            ? colors.black
            : colors.purpleGrey,
        white:
          themeVariant === THEME_VARIANTS.LIGHT ? colors.white : colors.black,
      },
      primary: {
        main:
          themeVariant === THEME_VARIANTS.LIGHT
            ? colors.green
            : colors.neonTurquoise,
        light: colors.aqua,
        dark:
          themeVariant === THEME_VARIANTS.LIGHT
            ? colors.matteGreen
            : colors.white,
        contrastText:
          themeVariant === THEME_VARIANTS.LIGHT ? colors.white : colors.black,
        accent: colors.turquoise,
      },
      secondary: undefined,
      error: {
        main: colors.red,
      },
      warning: {
        main: colors.orange,
      },
      info: {
        main:
          themeVariant === THEME_VARIANTS.LIGHT
            ? colors.neonTurquoise
            : colors.white,
        dark: colors.aqua,
        light: alpha(colors.neonTurquoise, 0.15),
      },
      success: {
        main: colors.aqua,
        accent: colors.greenAccent,
      },
      typography: {
        main:
          themeVariant === THEME_VARIANTS.LIGHT ? colors.black : colors.white,
        light:
          themeVariant === THEME_VARIANTS.LIGHT
            ? colors.darkGrey
            : colors.greenGrey,
        contrastText:
          themeVariant === THEME_VARIANTS.LIGHT ? colors.white : colors.black,
        accent: colors.aqua,
      },
      background: {
        paper:
          themeVariant === THEME_VARIANTS.LIGHT
            ? colors.white
            : colors.darkGreen,
        default:
          themeVariant === THEME_VARIANTS.LIGHT
            ? colors.iceWhite
            : colors.black,
        accentDefault:
          themeVariant === THEME_VARIANTS.LIGHT ? colors.black : colors.white,
        accentPaper: colors.matteGreen,
      },
      borders: {
        paper:
          themeVariant === THEME_VARIANTS.LIGHT
            ? colors.purpleGrey
            : colors.blueGreen,
        default:
          themeVariant === THEME_VARIANTS.LIGHT
            ? colors.lightGrey
            : colors.blueGreen,
        accentDefault: colors.greenGrey,
        accentPaper: colors.secondaryGrey,
      },
      charts: {
        main: colors.turquoise,
        dark: colors.matteGreen,
        accent: colors.purple,
      },
    } as PaletteOptions,
    typography: {
      fontFamily: 'Avenir-Next, sans-serif',
      fontWeightLight: fontWeight.light,
      fontWeightRegular: fontWeight.medium,
      fontWeightMedium: fontWeight.demiBold,
      fontWeightBold: fontWeight.bold,
      // Font sizes are specified in rems here to accommodate
      // users who want to change their font sizes via the browser
      // for accessibility reasons. There should be no reason to
      // override any of the font sizes specified here within the app
      h1: {
        fontSize: pxToRem(48),
        fontWeight: fontWeight.bold,
        lineHeight,
        color: getFontColors(themeVariant).primary,
        marginBottom: pxToMargin(48),
      },
      h2: {
        fontSize: pxToRem(32),
        fontWeight: fontWeight.demiBold,
        lineHeight,
        color: getFontColors(themeVariant).primary,
        marginBottom: pxToMargin(32),
      },
      h3: {
        fontSize: pxToRem(24),
        fontWeight: fontWeight.bold,
        lineHeight,
        color: getFontColors(themeVariant).primary,
        marginBottom: pxToMargin(24),
      },
      // Uses: module title, large table data
      h4: {
        fontSize: pxToRem(16),
        fontWeight: fontWeight.demiBold,
        lineHeight,
        color: getFontColors(themeVariant).primary,
        marginBottom: pxToMargin(16),
      },
      // Uses: table column titles, paragraph titles, side nav
      h5: {
        fontSize: pxToRem(12),
        fontWeight: fontWeight.demiBold,
        lineHeight,
        letterSpacing: pxToRem(1),
        textTransform: 'uppercase',
        color: getFontColors(themeVariant).secondary,
        marginBottom: pxToMargin(12),
      },
      // Uses: paragraph, labels
      body1: {
        fontSize: pxToRem(14),
        fontWeight: fontWeight.medium,
        color: getFontColors(themeVariant).secondary,
        lineHeight,
        marginBottom: pxToMargin(14),
      },
      labelValue: {
        fontSize: pxToRem(14),
        fontWeight: fontWeight.bold,
        color: getFontColors(themeVariant).primary,
        lineHeight,
        marginBottom: pxToMargin(14),
      },
      tableCell: {
        fontSize: pxToRem(14),
        fontWeight: fontWeight.medium,
        color: getFontColors(themeVariant).primary,
        lineHeight,
      },
      // Uses: secondary text in table cells, tooltip
      body2: {
        fontSize: pxToRem(12),
        fontWeight: fontWeight.medium,
        color: fontColor.secondary,
        lineHeight,
        marginBottom: pxToMargin(12),
      },
      button: {
        fontSize: pxToRem(16),
        fontWeight: fontWeight.medium,
        color: getFontColors(themeVariant).primary,
        lineHeight,
        textTransform: 'none',
      },
      // Uses: preceded by H1 or H2
      subtitle1: {
        fontSize: pxToRem(16),
        fontWeight: fontWeight.medium,
        color: getFontColors(themeVariant).primary,
        lineHeight,
        marginBottom: pxToMargin(16),
      },
      largeNumber: {
        fontSize: pxToRem(26),
        fontWeight: fontWeight.demiBold,
        color: getFontColors(themeVariant).primary,
        lineHeight,
        marginBottom: pxToMargin(26),
      },
      largeNumberLabel: {
        fontSize: pxToRem(12),
        fontWeight: fontWeight.medium,
        color: getFontColors(themeVariant).secondary,
        lineHeight,
        textTransform: 'uppercase',
        letterSpacing: pxToRem(2),
        marginBottom: pxToMargin(12),
      },
      largeInput: {
        fontSize: pxToRem(24),
        fontWeight: fontWeight.medium,
        color: getFontColors(themeVariant).primary,
        lineHeight,
        marginBottom: pxToMargin(24),
      },
      largeInputEmphasized: {
        fontSize: pxToRem(24),
        fontWeight: fontWeight.demiBold,
        color: getFontColors(themeVariant).primary,
        lineHeight,
        marginBottom: pxToMargin(24),
      },
      link: {
        fontSize: pxToRem(12),
        fontWeight: fontWeight.medium,
        color: getFontColors(themeVariant).accent,
        textDecoration: 'underline',
        lineHeight,
        marginBottom: pxToMargin(12),
      },
      caption: {
        fontSize: pxToRem(10),
        fontWeight: fontWeight.medium,
        color: getFontColors(themeVariant).secondary,
        lineHeight,
        marginBottom: pxToMargin(10),
      },
      captionAccent: {
        fontSize: pxToRem(10),
        fontWeight: fontWeight.demiBold,
        color: getFontColors(themeVariant).accent,
        letterSpacing: pxToRem(1),
        lineHeight,
        marginBottom: pxToMargin(10),
      },
      // NOTE: these MUI options are disabled
      h6: undefined,
      subtitle2: undefined,
      overline: undefined,
    },
    shape: {
      // TODO: can we make this a function?
      borderStandard:
        themeVariant === THEME_VARIANTS.LIGHT
          ? `1px solid ${colors.purpleGrey}`
          : `1px solid ${colors.blueGreen}`,
      borderHighlight: `1px solid ${colors.neonTurquoise}`,
      borderRadius: () => '6px',
      borderRadiusLarge: '10px',
      shadowStandard:
        themeVariant === THEME_VARIANTS.LIGHT
          ? '0px 4px 10px rgba(20, 42, 74, 0.07)'
          : '0px 4px 10px rgba(51, 248, 255, 0.07)',
      shadowLarge: (color = '#142a4a4d') =>
        themeVariant === THEME_VARIANTS.LIGHT
          ? `0px 34px 50px -15px ${color}`
          : `0px 34px 50px -15px rgba(51, 248, 255, 0.3)`,
      shadowLandingPage:
        themeVariant === THEME_VARIANTS.LIGHT
          ? '0px 4px 10px 0px #142A4A12'
          : '0px 4px 15px rgba(51, 248, 255, 0.25)',
      shadowAccent:
        themeVariant === THEME_VARIANTS.LIGHT
          ? '0px 4px 50px -10px #33f8ff'
          : '0px 4px 50px -10px #33F8FF',
    } as ShapeOptions,
    gradient: {
      lightGreen: 'linear-gradient(180deg, #259C9C -47.56%, #1BD7D9 229.78%)',
      darkGreen: 'linear-gradient(270deg, #053542 -45.52%, #06657E 123.72%)',
      darkBlue: 'linear-gradient(270deg, #06657E -45.52%, #053542 123.72%)',
      green: 'linear-gradient(90deg, #004453 0%, #21B3B4 100%)',
      landing:
        'linear-gradient(271.53deg, rgba(191, 201, 245, 0.5) -60.81%, rgba(142, 161, 245, 0.5) -60.79%, #26CBCF 105.36%)',
      landingVertical:
        'linear-gradient(333.55deg, #49E0E6 14.29%, #21B3B4 82.14%)',
      aqua: 'linear-gradient(180deg, #2BCAD0 0%, #8BC1E5 100%)',
      // Creates a "glow" effect on hover for an element where the gradient transitions
      // from one to another
      hoverTransition: (start: string, end: string, zIndex = 1) => `
        background: ${start};
        position: relative;
        z-index: ${zIndex};

        &::before {
          position: absolute;
          content: '';
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          border-radius: inherit;
          background: ${end};
          z-index: ${zIndex - 1};
          transition: opacity 0.25s linear;
          opacity: 0;
        }

        &:hover::before {
          opacity: 1;
        }
      `,
    } as GradientOptions,
  };

  return theme;
};

export type NotionalPageLayoutOptions = 'landing' | 'app';

export const useNotionalTheme = (themeVariant: PaletteMode) => {
  const notionalTheme = createTheme(getThemeData(themeVariant));
  return notionalTheme;
};
