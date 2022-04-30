import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components';
import { ModalProvider } from 'styled-react-modal'

import Theme from 'theme'
import { Navigation, Router, Header } from './components'
import Context, { context } from 'Context'
import THEMES from '../sharedComponents/colors'

const BackgroundComponent = styled.div`
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 30;
    background-color: ${({theme}) => theme.BACKGROUND_PRIMARY };
    display: flex;
    justify-content: center;
    align-items: center;
    
    > div {
        padding: 1rem;
        border: ${({theme}) => theme.FOREGROUND_TEXT } solid 2px;
        background-color: ${({theme}) => theme.BACKGROUND_PRIMARY };
        position: static;
        max-width: 80vw;
        min-width: 500px;
    }
`
const App = () => {
  const { dispatch, state } = React.useContext(context)
  const navigate = useLocation()

  return (
    <ThemeProvider theme={THEMES[state.settings.colorTheme]}>
      <Theme.GlobalStyle />
      <ModalProvider backgroundComponent={BackgroundComponent}>
        <div>
          <Header />
          <Navigation />
          <Router />
        </div>
      </ModalProvider>
    </ThemeProvider>
  )
}

const InjectedApp = () => {
  return (
    <BrowserRouter>
      <Context>
        <App />
      </Context>
    </BrowserRouter>
  )
}

export default InjectedApp
