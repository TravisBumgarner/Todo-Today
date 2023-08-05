import React, { forwardRef } from 'react'
import { type LinkProps, createTheme } from '@mui/material'
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom'

import { type ThemeOptions } from '@mui/material/styles'

const LinkBehavior = forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props
  return <RouterLink ref={ref} to={href} {...other} />
})
LinkBehavior.displayName = 'LinkBehavior'

const baseTheme = {
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior
      } as LinkProps
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior
      }
    }
  }
}

const beachThemeOptions: ThemeOptions = {
  ...baseTheme,
  palette: {
    primary: {
      main: '#7bc3ff'
    },
    secondary: {
      main: '#7bff7f'
    },
    background: {
      default: '#456990',
      paper: '#456990'
    },
    warning: {
      main: '#7f3a3a'
    },
    error: {
      main: '#ff3f85'
    }
  }
}

export const themeOptions2: ThemeOptions = {
  ...baseTheme,
  palette: {
    mode: 'dark'
  },
  typography: {
    h2: {
      fontSize: '2rem',
      fontWeight: 700
    }
  }

}

export const beachTheme = createTheme(beachThemeOptions)
export const theme2 = createTheme(themeOptions2)

export const pageHeaderCSS = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '0 0 1rem 0',
  height: '60px'
}
