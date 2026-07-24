import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useRef } from "react";
import { CHANNEL_INVOKES } from "../../shared/types";
import ipcMessenger from "../ipcMessenger";
import { densitySignal, themeSignal } from "../signals";
import { AppGlobalStyles } from "./GlobalStyles";
import { buildTheme, resolveDensity, resolveThemeId, THEMES } from "./themes";

export const TAB_HEIGHT = "36px";

const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  useSignals();
  const seeded = useRef(false);

  // Seed the theme/density signals from the persisted store exactly once.
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    ipcMessenger
      .invoke(CHANNEL_INVOKES.STORE.GET, undefined)
      .then(({ theme, density }) => {
        themeSignal.value = resolveThemeId(theme);
        densitySignal.value = resolveDensity(density);
      });
  }, []);

  // useSignals() re-renders this provider only when theme/density change, so
  // building the MUI theme inline recomputes exactly when needed.
  const theme = buildTheme(THEMES[themeSignal.value], densitySignal.value);

  return (
    <ThemeProvider theme={theme}>
      <AppGlobalStyles />
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
