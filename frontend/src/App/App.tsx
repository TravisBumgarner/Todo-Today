import React from 'react';
import { BrowserRouter } from 'react-router-dom'

import Theme from 'theme'
import { Navigation, Router, Header } from './components'
import Context, {context} from 'Context'
import { LabelAndInput } from 'sharedComponents';

const App = () => {
  const { dispatch, state } = React.useContext(context)
  console.log('new state', state)
  return (
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <div style={{ width: '20%' }}>
          <Navigation />
        </div>
        <div style={{ width: '80%' }}>
          <Router />
        </div>
      </div>

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
