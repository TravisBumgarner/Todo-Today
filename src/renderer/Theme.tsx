import { createTheme, type ThemeOptions } from "@mui/material/styles";

// --- Helper to generate typography from a palette ---
const makeTypography = (palette: any): ThemeOptions["typography"] => ({
  fontFamily: "Comfortaa",
  h1: {
    fontSize: "1.5rem",
    fontWeight: 400,
    lineHeight: 1.35,
  },
  h2: {
    color: palette.secondary.main,
    fontSize: "1.7rem",
    fontWeight: 700,
    lineHeight: 1.35,
  },
  h3: {
    color: palette.primary.main,
    fontSize: "1.4rem",
    fontWeight: 400,
    lineHeight: 1.35,
    margin: "0 0 0.5rem 0",
  },
  body1: {
    color: palette.text.primary,
  },
  body2: {
    color: palette.text.primary,
  },
});

// --- Light palette ---
const lightPalette = {
  info: { main: "rgb(184, 203, 210)" },
  primary: { main: "rgb(76, 125, 165)" },
  secondary: { main: "rgb(24, 189, 162)" },
  text: { primary: "rgb(92, 94, 95)" },
  action: { disabled: "rgb(97, 96, 96)" },
  background: {
    default: "rgb(234, 249, 255)",
    paper: "rgb(206, 228, 236)",
  },
  warning: { main: "rgb(228, 142, 12)" },
  error: { main: "rgb(241, 40, 46)" },
};

// --- Dark palette ---
const darkPalette = {
  info: { main: "rgb(234, 249, 255)" },
  primary: { main: "rgb(51, 255, 218)" },
  secondary: { main: "rgb(78, 204, 236)" },
  text: { primary: "rgb(211, 244, 255)" },
  action: { disabled: "rgb(172, 172, 172)" },
  background: {
    default: "rgb(27, 45, 59)",
    paper: "rgb(34, 56, 74)",
  },
  warning: { main: "rgb(228, 142, 12)" },
  error: { main: "rgb(241, 40, 46)" },
};

// --- Theme creation ---
export const lightTheme = createTheme({
  palette: lightPalette,
  typography: makeTypography(lightPalette),
});

export const darkTheme = createTheme({
  palette: darkPalette,
  typography: makeTypography(darkPalette),
});

// --- Constants ---
export const BUTTONS_WRAPPER_HEIGHT = 36;

export const SPACING = {
  XXSMALL: 4,
  XSMALL: 8,
  SMALL: 12,
  MEDIUM: 16,
  LARGE: 24,
  XLARGE: 32,
  XXLARGE: 48,
} as const;
