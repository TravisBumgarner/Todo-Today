import React, { useCallback } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { GlobalStyles } from '@mui/material'

import Context, { context } from 'Context'
import { Navigation, Router, Header } from './components'
import { setupAutomatedBackup } from './pages/Settings'
import LazyLoadModal, { ModalID } from 'modals'
import { globalCSS } from 'theme'

const App = () => {
  const { state, dispatch } = React.useContext(context)

  const triggerBackupFailureModal = useCallback(() => {
    dispatch({
      type: 'SET_ACTIVE_MODAL',
      payload: {
        id: ModalID.BACKUP_FAILURE_MODAL
      }
    })
  }, [dispatch])
  React.useEffect(() => { setupAutomatedBackup(triggerBackupFailureModal) }, [state.backupInterval, triggerBackupFailureModal])

  return (
    <>
      <GlobalStyles styles={globalCSS} />
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Header />
          <Navigation />
        </div>
        <Router />
        <LazyLoadModal />
      </div>
    </>
  )
}

class ErrorBoundary extends React.Component<{ children: any }, { hasError: boolean, error: string }> {
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
