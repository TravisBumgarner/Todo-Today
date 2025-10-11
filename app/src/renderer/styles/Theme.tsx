import { CssBaseline, useMediaQuery } from "@mui/material";
import {
  createTheme,
  ThemeProvider,
  type ThemeOptions,
} from "@mui/material/styles";
import { useMemo } from "react";
import { AppGlobalStyles } from "./GlobalStyles";
import { BORDER_RADIUS, darkPalette, lightPalette } from "./consts";

const components: ThemeOptions["components"] = {
  MuiCheckbox: {
    styleOverrides: {
      root: {
        borderRadius: BORDER_RADIUS.ZERO.PX,
      },
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: {
        borderRadius: BORDER_RADIUS.ZERO.PX,
      },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        borderRadius: BORDER_RADIUS.ZERO.PX,
        textTransform: "none",
        "&.Mui-selected": {
          fontWeight: 700,
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: BORDER_RADIUS.ZERO.PX,
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: 0,
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: BORDER_RADIUS.ZERO.PX,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
        borderRadius: BORDER_RADIUS.ZERO.PX,
        boxShadow: "none",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "none",
        },
        "&:disabled": {
          cursor: "not-allowed",
        },
      },
      contained: {
        fontWeight: 900,
      },
      outlined: {
        fontWeight: 600,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        borderRadius: BORDER_RADIUS.ZERO.PX,
      },
    },
  },
};

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

export const lightTheme = createTheme({
  palette: lightPalette,
  typography: makeTypography(lightPalette),
  components,
});

export const darkTheme = createTheme({
  palette: darkPalette,
  typography: makeTypography(darkPalette),
  components,
});

export const AppThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () => (prefersDarkMode ? darkTheme : lightTheme),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <AppGlobalStyles />
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
