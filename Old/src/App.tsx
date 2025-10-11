// https://stackoverflow.com/questions/74542488/react-material-ui-createtheme-default-is-not-a-function
import CssBaseline from '@mui/material/CssBaseline'

import { Box, css, Experimental_CssVarsProvider } from '@mui/material'
import { useEffect, useState } from 'react'

import Message from 'components/Message'
import TodoList from 'components/TodoList'
import RenderModal from 'modals'
import { darkTheme, lightTheme, SPACING } from 'theme'

import { useSignals } from '@preact/signals-react/runtime'
import { useIPCAsyncMessageEffect } from './hooks/useIPCAsyncMessageEffect'
import { isRestoringSignal } from './signals'

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
      <Box css={appWrapperCSS}>
        <Message />
        <TodoList />
      </Box>
      <RenderModal />
    </Experimental_CssVarsProvider>
  )
}

const appWrapperCSS = css`
  max-width: 1200px;
  margin:0px auto;
  height: 100%;
  box-sizing:  border-box;
  padding: ${SPACING.MEDIUM}px;
`

export default App
