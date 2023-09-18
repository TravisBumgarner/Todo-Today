import { Component, useCallback, useContext, useEffect, useMemo } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Box, CssBaseline } from '@mui/material'
import { Experimental_CssVarsProvider as CssVarsProvider, css } from '@mui/material/styles'

import Context, { context } from 'Context'
import { Header, Router } from './components'
import { setupAutomatedBackup } from './modals/SettingsModal'
import LazyLoadModal, { ModalID } from 'modals'
import { baseTheme, beachTheme, highContrastTheme, retroFutureTheme, underTheSeaTheme } from 'theme'
import { EColorTheme } from 'sharedTypes'
import { channels } from '../constants';

const { ipcRenderer } = window.require('electron');


const App = () => {
  const { state, dispatch } = useContext(context)

  const getData = () => {
    ipcRenderer.send(channels.GET_DATA, { product: 'notebook' });
  };

  const triggerBackupFailureModal = useCallback(() => {
    dispatch({
      type: 'SET_ACTIVE_MODAL',
      payload: {
        id: ModalID.CONFIRMATION_MODAL,
        title: 'Something went Wrong',
        body: 'Automated backup failed to run'
      }
    })
  }, [dispatch])
  useEffect(() => { setupAutomatedBackup(triggerBackupFailureModal) }, [state.settings.backupInterval, triggerBackupFailureModal])

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
    <CssVarsProvider theme={theme}>
      <button onClick={getData}>Click Me</button>

      <CssBaseline />
      <Box css={appWrapperCSS}>
        <Header />
        <Router />
      </Box>
      <LazyLoadModal />
    </CssVarsProvider>
  )
}

const appWrapperCSS = css`
  padding: 1rem;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
`

class ErrorBoundary extends Component<{ children: any }, { hasError: boolean, error: string }> {
  constructor(props: any) {
    super(props)
    this.state = {
      hasError: false,
      error: ''
    }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    this.setState({ error: `${JSON.stringify(error.message)}\n${JSON.stringify(errorInfo)} ` })
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h1>Something went wrong.</h1>
          <p>Message: ${this.state.error}</p>
        </>
      )
    }

    return this.props.children
  }
}

const InjectedApp = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Context>
          <App />
        </Context>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default InjectedApp
