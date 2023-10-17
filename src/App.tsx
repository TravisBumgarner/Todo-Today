import { useContext, useEffect, useMemo, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline' // https://stackoverflow.com/questions/74542488/react-material-ui-createtheme-default-is-not-a-function
import { Box, Experimental_CssVarsProvider, css } from '@mui/material'

import { EColorTheme } from './types'
import Context, { type Action, context } from 'Context'
import { baseTheme, beachTheme, highContrastTheme, retroFutureTheme, underTheSeaTheme } from 'theme'
import { Header, Router, Message } from './components'
import RenderModal from 'modals'
import { useAsyncEffect } from 'use-async-effect'
import { EMessageIPCFromRenderer } from 'shared/types'
import { sendIPCMessage } from 'utilities'
import { ipcRenderer } from 'electron'

const useIPCRendererEffect = (dispatch: React.Dispatch<Action>) => {
  ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available')
    dispatch({ type: 'ADD_MESSAGE', data: { text: 'A new update is available. Downloading now...', severity: 'info' } })
  })

  ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded')
    dispatch({ type: 'ADD_MESSAGE', data: { text: 'Update Downloaded. It will be installed on restart. Restart now?', severity: 'info', callback: () => { ipcRenderer.send('restart_app') } } })
  })
}

const App = () => {
  const { state, dispatch } = useContext(context)
  useIPCRendererEffect(dispatch)

  useEffect(() => {
    dispatch({ type: 'ADD_MESSAGE', data: { text: 'Hello World', severity: 'success', callback: () => { alert('hi') } } })
  }, [dispatch])

  const theme = useMemo(() => {
    switch (state.settings.colorTheme) {
      case EColorTheme.BEACH: {
        return beachTheme
      }
      case EColorTheme.RETRO_FUTURE: {
        return retroFutureTheme
      }
      case EColorTheme.UNDER_THE_SEA: {
        return underTheSeaTheme
      }
      case EColorTheme.CONTRAST: {
        return highContrastTheme
      }
      default: {
        return baseTheme
      }
    }
  }, [state.settings.colorTheme])

  return (
    <Experimental_CssVarsProvider theme={theme}>
      <CssBaseline />
      <Box css={appWrapperCSS}>
        <Message />
        <Header />
        <Router />
      </Box>
      <RenderModal />
    </Experimental_CssVarsProvider>
  )
}

const appWrapperCSS = css`
  padding: 0 0.5rem 0.5rem 0.5rem;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
`

const InjectedApp = () => {
  const [appVersion, setAppVersion] = useState<string>()

  useAsyncEffect(async (isMounted) => {
    const response = await sendIPCMessage({ type: EMessageIPCFromRenderer.Version })
    console.log(response)
    if (!isMounted()) return

    setAppVersion(response.version)
  }, [])

  return (
    <Context>
      <App />
      <p style={{ position: 'absolute', bottom: 0, right: '1rem' }}>Version: {appVersion} </p>
    </Context>
  )
}

export default InjectedApp
