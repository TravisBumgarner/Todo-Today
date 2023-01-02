import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'
import { ModalProvider } from 'styled-react-modal'
import { darken } from 'polished'

import Context, { context } from 'Context'
import Theme from 'theme'
import { ConfirmationModal } from 'sharedComponents'
import { Navigation, Router, Header } from './components'
import THEMES from '../sharedComponents/colors'
import { setupAutomatedBackup } from './pages/Settings'

const ModalBackground = styled.div`
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 30;
    
    background-color: ${(props) => {
        return darken(0.05, props.theme.BACKGROUND)
    }};
    display: flex;
    justify-content: center;
    align-items: center;
    
    > div {
        padding: 2rem;
        border: ${({ theme }) => theme.FOREGROUND} solid 2px;
        background-color: ${({ theme }) => theme.BACKGROUND};
        position: static;
        max-width: 80vw;
        max-height: 80vh;
        overflow-y: auto;
    }
`

const App = () => {
    const { state } = React.useContext(context)
    const [showAutomatedBackupModal, setShowAutomatedBackupModal] = React.useState<boolean>(false)
    React.useEffect(() => setupAutomatedBackup(setShowAutomatedBackupModal), [state.backupInterval])

    return (
        <ThemeProvider theme={THEMES[state.colorTheme]}>
            <Theme.GlobalStyle />
            <ModalProvider backgroundComponent={ModalBackground}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Header />
                        <Navigation />
                    </div>
                    <Router />
                </div>
                <ConfirmationModal
                    body="The automated backup failed to run."
                    title="Heads Up!"
                    confirmationCallback={() => setShowAutomatedBackupModal(false)}
                    showModal={showAutomatedBackupModal}
                    setShowModal={setShowAutomatedBackupModal}
                />
            </ModalProvider>
        </ThemeProvider>
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
