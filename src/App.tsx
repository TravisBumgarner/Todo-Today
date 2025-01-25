// https://stackoverflow.com/questions/74542488/react-material-ui-createtheme-default-is-not-a-function
import CssBaseline from '@mui/material/CssBaseline'

import { Box, css, Experimental_CssVarsProvider } from '@mui/material'
import { useState } from 'react'

import Message from 'components/Message'
import TodoList from 'components/TodoList'
import RenderModal from 'modals'
import { baseTheme, beachTheme, highContrastTheme, retroFutureTheme, SPACING, underTheSeaTheme } from 'theme'
import { EColorTheme } from './types'

import { useSignalEffect } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import { useIPCAsyncMessageEffect } from './hooks/useIPCAsyncMessageEffect'
import { isRestoringSignal, settingsSignal } from './signals'

const App = () => {
  useSignals()
  const [theme, setTheme] = useState(baseTheme)

  useIPCAsyncMessageEffect()

  useSignalEffect(() => {
    const THEME_MAP = {
      [EColorTheme.BEACH]: beachTheme,
      [EColorTheme.RETRO_FUTURE]: retroFutureTheme,
      [EColorTheme.UNDER_THE_SEA]: underTheSeaTheme,
      [EColorTheme.CONTRAST]: highContrastTheme
    }

    setTheme(THEME_MAP[settingsSignal.value.colorTheme])
  })

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
