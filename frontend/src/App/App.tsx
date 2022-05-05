import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components';
import { ModalProvider } from 'styled-react-modal'
import { darken } from 'polished'

import Theme from 'theme'
import { Navigation, Router, Header } from './components'
import THEMES from '../sharedComponents/colors'
import { TBackupInterval, TColorTheme, TDateFormat, TWeekStart } from 'sharedTypes';
import useLocalStorage from '../localStorage';
import { automatedBackup } from './pages/Backups';

const HAS_DONE_WARM_START = 'HAS_DONE_WARM_START'
const TRUE = 'TRUE'

const warmStart = () => {
  const DEFAULT_SETTINGS = {
    dateFormat: TDateFormat.A,
    weekStart: TWeekStart.SUNDAY,
    colorTheme: TColorTheme.BEACH,
    backupInterval: TBackupInterval.DAILY
  }

  Object
    .keys(DEFAULT_SETTINGS)
    .forEach((key: keyof typeof DEFAULT_SETTINGS) => localStorage.setItem(key, DEFAULT_SETTINGS[key]))

  localStorage.setItem(HAS_DONE_WARM_START, TRUE)
}

const ModalBackground = styled.div`
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 30;
    
    background-color: ${props => {
    return darken(0.05, props.theme.BACKGROUND_PRIMARY)
  }};
    display: flex;
    justify-content: center;
    align-items: center;
    
    > div {
        padding: 2rem;
        border: ${({ theme }) => theme.FOREGROUND_TEXT} solid 2px;
        background-color: ${({ theme }) => theme.BACKGROUND_PRIMARY};
        position: static;
        max-width: 80vw;
        max-height: 80vh;
        overflow-y: auto;
    }
`

const App = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    if (!(localStorage.getItem(HAS_DONE_WARM_START) === TRUE)) {
      warmStart()
    }
    setIsLoading(false)
  }, [])
  const [colorTheme] = useLocalStorage('colorTheme');

  React.useEffect(() => automatedBackup(), [])

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <ThemeProvider theme={THEMES[colorTheme]}>
      <Theme.GlobalStyle />
      <ModalProvider backgroundComponent={ModalBackground}>
        <div>
          <Header />
          <Navigation />
          <Router />
        </div>
      </ModalProvider>
    </ThemeProvider>
  )
}

class ErrorBoundary extends React.Component<{}, { hasError: boolean, error: string }> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      error: ''
    };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    this.setState({ error: `${JSON.stringify(error)}\n${JSON.stringify(errorInfo)}` });
  }

  render() {
    if (this.state.hasError) {
      return <>
        <h1>Something went wrong.</h1>;
        <p>Message: ${this.state.error}</p>
      </>
    }

    return this.props.children;
  }
}

const InjectedApp = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  )
}



export default InjectedApp
