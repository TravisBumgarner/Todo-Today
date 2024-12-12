// https://stackoverflow.com/questions/74542488/react-material-ui-createtheme-default-is-not-a-function
import CssBaseline from '@mui/material/CssBaseline'

import { Box, Experimental_CssVarsProvider, css } from '@mui/material'
import { useState } from 'react'

import RenderModal from 'modals'
import { baseTheme, beachTheme, highContrastTheme, retroFutureTheme, underTheSeaTheme } from 'theme'
import { Header, Message, QueueMode } from './components'
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
        <Header />
        <QueueMode />
      </Box>
      <RenderModal />
    </Experimental_CssVarsProvider>
  )
}

const appWrapperCSS = css`
  padding: 0 0.5rem 0.5rem 0.5rem;
  max-width: 1200px;
  margin:0px auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
`

export default App
