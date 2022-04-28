import React from 'react';
import { BrowserRouter } from 'react-router-dom'

import Theme from 'theme'
import { Navigation, Router, Header } from './components'
import Context, { context } from 'Context'

const App = () => {
  const { dispatch, state } = React.useContext(context)
  console.log('APP STATE', state)
  return (
    <div>
      <Header />
      <Navigation />
      <Router />
    </div>
  )
}

const InjectedApp = () => {
  return (
    <BrowserRouter>
      <Theme.GlobalStyle />
      <Context>
        <App />
      </Context>
    </BrowserRouter>
  )
}

export default InjectedApp
