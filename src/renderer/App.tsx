import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { CHANNEL } from "../shared/types";
import type { ElectronHandler } from "../main/preload";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, css, ThemeProvider } from "@mui/material";

import Message from "./components/Message";
import TodoList from "./components/TodoList";
import RenderModal from "./modals";
import { darkTheme, lightTheme, SPACING } from "./Theme";
import { AppGlobalStyles } from "./GlobalStyles";

import { useSignals } from "@preact/signals-react/runtime";
// import { useIPCAsyncMessageEffect } from "./hooks/useIPCAsyncMessageEffect";
import { isRestoringSignal } from "./signals";

declare global {
  interface Window {
    electron: ElectronHandler;
  }
}

function App() {
  useSignals();
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setTheme(mediaQuery.matches ? darkTheme : lightTheme);
    };

    handleChange(); // Set initial theme
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // useIPCAsyncMessageEffect();

  useEffect(() => {
    window.electron.ipcRenderer.invoke(CHANNEL.WEE_WOO);
  });

  if (isRestoringSignal.value) {
    return <p>Loading...</p>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppGlobalStyles />
      <Box sx={appWrapperCSS}>
        <Message />
        <TodoList />
      </Box>
      <RenderModal />
    </ThemeProvider>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  );
}

const appWrapperCSS = css`
  max-width: 1200px;
  margin: 0px auto;
  height: 100%;
  box-sizing: border-box;
  padding: ${SPACING.MEDIUM}px;
`;
