export const lightPalette = {
  info: { main: "rgba(74, 83, 86, 1)" },
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
export const darkPalette = {
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

export const PALETTE = {
  grayscale: {
    0: "hsl(0 0% 100%)",
    50: "hsl(0 0% 95%)",
    100: "hsl(0 0% 90%)",
    200: "hsl(0 0% 80%)",
    300: "hsl(0 0% 70%)",
    400: "hsl(0 0% 60%)",
    500: "hsl(0 0% 50%)",
    600: "hsl(0 0% 40%)",
    700: "hsl(0 0% 30%)",
    800: "hsl(0 0% 20%)",
    850: "hsl(0 0% 15%)",
    900: "hsl(0 0% 10%)",
    1000: "hsl(0 0% 0%)",
  },
};

export const BUTTONS_WRAPPER_HEIGHT = 36;

export const FONT_SIZES = {
  SMALL: {
    PX: "12px",
    INT: 12,
  },
  MEDIUM: {
    PX: "16px",
    INT: 16,
  },
  LARGE: {
    PX: "24px",
    INT: 24,
  },
  HUGE: {
    PX: "32px",
    INT: 32,
  },
  HUGE_PLUS: {
    PX: "48px",
    INT: 48,
  },
};

export const SPACING = {
  TINY: {
    PX: "4px",
    INT: 4,
  },
  SMALL: {
    PX: "10px",
    INT: 10,
  },
  MEDIUM: {
    PX: "20px",
    INT: 20,
  },
  LARGE: {
    PX: "36px",
    INT: 36,
  },
  HUGE: {
    PX: "48px",
    INT: 48,
  },
  OMNIPRESENT: {
    PX: "128px",
    INT: 128,
  },
} as const;

export const BORDER_RADIUS = {
  ZERO: {
    PX: "0px",
    INT: 0,
  },
  MEDIUM: {
    PX: "10px",
    INT: 10,
  },
};

export const LIGHT_BUTTON_STYLES = {
  color: PALETTE.grayscale[50],
  background: PALETTE.grayscale[800],
  hoverBackground: PALETTE.grayscale[800],
};

export const DARK_BUTTON_STYLES = {
  color: PALETTE.grayscale[900],
  background: PALETTE.grayscale[200],
  hoverBackground: PALETTE.grayscale[100],
};

export const SCROLLBAR_WIDTH_PX = "12px";
