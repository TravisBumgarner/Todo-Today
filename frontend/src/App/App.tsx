import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import styled, { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'
import { darken } from 'polished'
// import { ThemeProvider } from '@mui/material' TODO: Migrate to MUI

import Context, { context } from 'Context'
import Theme from 'theme'
import { ConfirmationModal } from 'sharedComponents'
import { Navigation, Router, Header } from './components'
import THEMES from '../sharedComponents/colors'
import { setupAutomatedBackup } from './pages/Settings'
import LazyLoadModal from 'modals'

const App = () => {
  const { state } = React.useContext(context)
  const [showAutomatedBackupModal, setShowAutomatedBackupModal] = React.useState<boolean>(false)
  React.useEffect(() => { setupAutomatedBackup(setShowAutomatedBackupModal) }, [state.backupInterval])

  return (
    <StyledComponentsThemeProvider theme={THEMES[state.colorTheme]}>
      <Theme.GlobalStyle />
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Header />
          <Navigation />
        </div>
        <Router />
        <LazyLoadModal />
      </div>
      {/* <ConfirmationModal
        body="The automated backup failed to run."
        title="Heads Up!"
        confirmationCallback={() => { setShowAutomatedBackupModal(false) }}
        showModal={showAutomatedBackupModal}
        setShowModal={setShowAutomatedBackupModal}
      /> */}
    </StyledComponentsThemeProvider>
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
