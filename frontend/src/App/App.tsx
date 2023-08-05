import React, { Component, useCallback, useContext, useEffect, useMemo } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'

import Context, { context } from 'Context'
import { Navigation, Router, Title } from './components'
import { setupAutomatedBackup } from './pages/Settings'
import LazyLoadModal, { ModalID } from 'modals'
import { beachTheme, theme2 } from 'theme'
import { EColorTheme } from 'sharedTypes'

const App = () => {
  const { state, dispatch } = useContext(context)

  const triggerBackupFailureModal = useCallback(() => {
    dispatch({
      type: 'SET_ACTIVE_MODAL',
      payload: {
        id: ModalID.BACKUP_FAILURE_MODAL
      }
    })
  }, [dispatch])
  useEffect(() => { setupAutomatedBackup(triggerBackupFailureModal) }, [state.settings.backupInterval, triggerBackupFailureModal])

  const theme = useMemo(() => {
    switch (state.settings.colorTheme) {
      case EColorTheme.BEACH: {
        return beachTheme
      }
      default: {
        return theme2
      }
    }
  }, [state.settings.colorTheme])

  return (
    <ThemeProvider theme={theme}>
      <CssVarsProvider>
        <CssBaseline />
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title />
            <Navigation />
          </div>
          <Router />
          <LazyLoadModal />
        </div>
      </CssVarsProvider>
    </ThemeProvider>
  )
}

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
    this.setState({ error: `${JSON.stringify(error.message)}\n${JSON.stringify(errorInfo)}` })
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
