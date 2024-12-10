// https://stackoverflow.com/questions/74542488/react-material-ui-createtheme-default-is-not-a-function
import CssBaseline from '@mui/material/CssBaseline'

import { Box, Experimental_CssVarsProvider, css } from '@mui/material'
import { useCallback, useContext, useState } from 'react'

import Context, { context } from 'Context'
import RenderModal from 'modals'
import { baseTheme, beachTheme, highContrastTheme, retroFutureTheme, underTheSeaTheme } from 'theme'
import { Header, Message, QueueMode } from './components'
import { EColorTheme } from './types'

import { useSignalEffect } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import { setLocalStorage } from 'utilities'
import { useIPCAsyncMessageEffect } from './hooks/useIPCAsyncMessageEffect'
import { settingsSignal } from './signals'

const App = () => {
  useSignals()
  const [theme, setTheme] = useState(baseTheme)

  const syncSettingsToLocalStorage = useCallback(() => {
    if (settingsSignal.value) {
      Object.entries(settingsSignal.value).forEach(([key, value]) => {
        setLocalStorage(key as keyof typeof settingsSignal.value, value)
      })
    }
  }, [])
  useSignalEffect(() => {
    syncSettingsToLocalStorage()
  })
  const { dispatch } = useContext(context)
  useIPCAsyncMessageEffect(dispatch)

  useSignalEffect(() => {
    const THEME_MAP = {
      [EColorTheme.BEACH]: beachTheme,
      [EColorTheme.RETRO_FUTURE]: retroFutureTheme,
      [EColorTheme.UNDER_THE_SEA]: underTheSeaTheme,
      [EColorTheme.CONTRAST]: highContrastTheme
    }

    setTheme(THEME_MAP[settingsSignal.value.colorTheme])
  })

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

const InjectedApp = () => {
  return (
    <Context>
      <App />
    </Context>
  )
}

export default InjectedApp
