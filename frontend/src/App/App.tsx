import { flexbox } from '@mui/system';
import React from 'react';
import { BrowserRouter } from 'react-router-dom'


import { Navigation, Router } from './components'


const App = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '20%' }}>
        <Navigation />
      </div>
      <div style={{ width: '80%' }}>
        <Router />
      </div>
    </div>
  )
}

const InjectedApp = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

export default InjectedApp
