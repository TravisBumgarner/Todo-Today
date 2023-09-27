import { useContext, useMemo } from 'react'
import { CssBaseline, Box, Experimental_CssVarsProvider, css } from '@mui/material'

import { EColorTheme } from './types'
import Context, { context } from 'Context'
import { baseTheme, beachTheme, highContrastTheme, retroFutureTheme, underTheSeaTheme } from 'theme'
import { Footer, Header, Router, TrafficLightsHover } from './components'
import LazyLoadModal from 'modals'

const App = () => {
  const { state } = useContext(context)

  const theme = useMemo(() => {
    switch (state.settings.colorTheme) {
      case EColorTheme.BEACH: {
        return beachTheme
      }
      case EColorTheme.RETRO_FUTURE: {
        return retroFutureTheme
      }
      case EColorTheme.UNDER_THE_SEA: {
        return underTheSeaTheme
      }
      case EColorTheme.CONTRAST: {
        return highContrastTheme
      }
      default: {
        return baseTheme
      }
    }
  }, [state.settings.colorTheme])

  return (
    <Experimental_CssVarsProvider theme={theme}>
      <CssBaseline />
      <Box css={appWrapperCSS}>
        <Header />
        <Router />
        <Footer />
      </Box>
      <LazyLoadModal />
      <TrafficLightsHover />
    </Experimental_CssVarsProvider>
  )
}

const appWrapperCSS = css`
  padding: 0 0.5rem 0.5rem 0.5rem;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
`

const InjectedApp = () => {
  return (
    <Context>
      <App />
    </Context>
  )
}

export default InjectedApp