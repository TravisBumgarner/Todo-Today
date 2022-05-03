import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components';
import { ModalProvider } from 'styled-react-modal'

import Theme from 'theme'
import { Navigation, Router, Header } from './components'
import Context, { context } from 'Context'
import THEMES from '../sharedComponents/colors'
import { TColorTheme, TDateFormat, TWeekStart } from 'sharedTypes';
import useLocalStorage from '../localStorage';

const HAS_DONE_WARM_START = 'HAS_DONE_WARM_START'
const TRUE = 'TRUE'

const warmStart = () => {
    const DEFAULT_SETTINGS = {
      dateFormat: TDateFormat.A,
      weekStart: TWeekStart.SUNDAY,
      colorTheme: TColorTheme.BEACH
    }

    Object
      .keys(DEFAULT_SETTINGS)
      .forEach((key: keyof typeof DEFAULT_SETTINGS) => localStorage.setItem(key, DEFAULT_SETTINGS[key]))

    localStorage.setItem(HAS_DONE_WARM_START, TRUE)
}

const BackgroundComponent = styled.div`
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 30;
    background-color: ${props => {
      console.log(props)
      return props.theme.BACKGROUND_PRIMARY 
    }};
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
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const navigate = useLocation()
  
  console.log('state', state)
  React.useEffect(() => {
    if(!(localStorage.getItem(HAS_DONE_WARM_START) === TRUE)){
      warmStart()
    }
    setIsLoading(false)
  }, [])
  const [colorTheme] = useLocalStorage('colorTheme'); 
  
  if (isLoading) {
    return <p>Loading...</p>
}

  return (
    <ThemeProvider theme={THEMES[colorTheme]}>
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
