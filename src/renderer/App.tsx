// import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
// import { useEffect } from "react";
// import { CHANNEL } from "../shared/types";
// import type { ElectronHandler } from "../main/preload";

// declare global {
//   interface Window {
//     electron: ElectronHandler;
//   }
// }

// function App() {
//   useEffect(() => {
//     window.electron.ipcRenderer.invoke(CHANNEL.DB.GET_USERS);
//   });

//   const handleAddUser = async () => {
//     const response = await window.electron.ipcRenderer.invoke(
//       CHANNEL.DB.ADD_USER,
//       {
//         payload: { name: "Travis" },
//       }
//     );
//     alert(response.success);
//   };

//   return (
//     <div>
//       <button onClick={handleAddUser}>Add User</button>
//     </div>
//   );
// }

// export default function AppWrapper() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<App />} />
//       </Routes>
//     </Router>
//   );
// }

// https://stackoverflow.com/questions/74542488/react-material-ui-createtheme-default-is-not-a-function
import CssBaseline from '@mui/material/CssBaseline'

import { Box, css, Experimental_CssVarsProvider } from '@mui/material'
import { useEffect, useState } from 'react'

import Message from './components/Message'
import TodoList from './components/TodoList'
import RenderModal from './modals'
import { darkTheme, lightTheme, SPACING } from './theme'

import { useSignals } from '@preact/signals-react/runtime'
import { useIPCAsyncMessageEffect } from './hooks/useIPCAsyncMessageEffect'
import { isRestoringSignal } from './signals'
import type { ElectronHandler } from '../main/preload'

declare global {
  interface Window {
    electron: ElectronHandler
  }
}

const App = () => {
  useSignals()
  const [theme, setTheme] = useState(lightTheme)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      setTheme(mediaQuery.matches ? darkTheme : lightTheme)
    }

    handleChange() // Set initial theme
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  useIPCAsyncMessageEffect()

  if (isRestoringSignal.value) {
    return <p>Loading...</p>
  }

  return (
    <Experimental_CssVarsProvider theme={theme}>
      <CssBaseline />
      <Box sx={appWrapperCSS}>
        <Message />
        <TodoList />
      </Box>
      <RenderModal />
    </Experimental_CssVarsProvider>
  )
}

const appWrapperCSS = css`
  max-width: 1200px;
  margin: 0px auto;
  height: 100%;
  box-sizing: border-box;
  padding: ${SPACING.MEDIUM}px;
`

export default App
