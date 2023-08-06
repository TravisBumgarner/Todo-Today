import React, { Component, useCallback, useContext, useEffect, useMemo } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Box, CssBaseline } from '@mui/material'
import { Experimental_CssVarsProvider as CssVarsProvider, css } from '@mui/material/styles'

import Context, { context } from 'Context'
import { Header, Router } from './components'
import { setupAutomatedBackup } from './pages/Settings'
import LazyLoadModal, { ModalID } from 'modals'
import { baseTheme, beachTheme } from 'theme'
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
        return baseTheme
      }
    }
  }, [state.settings.colorTheme])

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Box css={appWrapperCSS}>
        <Header />
        <Router />
        <LazyLoadModal />
      </Box>
    </CssVarsProvider>
  )
}

const appWrapperCSS = css`
  margin: 1rem auto;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
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
