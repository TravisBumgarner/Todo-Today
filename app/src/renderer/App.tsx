import { Route, MemoryRouter as Router, Routes } from "react-router-dom";
import type { ElectronHandler } from "../main/preload";
import Message from "./components/Message";
import TodoList from "./components/TodoList";
import RenderModal from "./modals";
import AppThemeProvider from "./styles/Theme";
import { useSignals } from "@preact/signals-react/runtime";
import useShowChangelog from "./hooks/useShowChangelog";
import { isRestoringSignal } from "./signals";

declare global {
  interface Window {
    electron: ElectronHandler;
  }
}

function App() {
  useSignals();
  useShowChangelog()

  if (isRestoringSignal.value) {
    return <p>Loading...</p>;
  }

  return (
    <AppThemeProvider>
      <Message />
      <TodoList />
      <RenderModal />
    </AppThemeProvider>
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
