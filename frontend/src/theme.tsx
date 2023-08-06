import React, { forwardRef } from 'react'
import { type LinkProps } from '@mui/material'
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

import { type ThemeOptions } from '@mui/material/styles'

const LinkBehavior = forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props
  return <RouterLink ref={ref} to={href} {...other} />
})
LinkBehavior.displayName = 'LinkBehavior'

const baseThemeOptions: ThemeOptions = {
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
  },
  typography: {
    fontFamily: 'Comfortaa',
    h1: {
      fontSize: '2rem',
      fontWeight: 400,
      lineHeight: 1.35
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.35,
      color: 'var(--mui-palette-warning-main)'
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 400,
      lineHeight: 1.35,
      color: 'var(--mui-palette-warning-main)'
    },
    h4: {
      fontSize: '1.3rem',
      fontWeight: 400,
      lineHeight: 1.35,
      color: 'var(--mui-palette-warning-main)'
    }
  }
}

const beachThemeOptions: ThemeOptions = {
  ...baseThemeOptions,
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
      main: '#ef7a76'
    },
    error: {
      main: '#ff3f85'
    }
  }
}

// export const themeOptions2: ThemeOptions = {
//   ...baseTheme,
//   palette: {
//     mode: 'dark'
//   },
//   typography: {
//     h2: {
//       fontSize: '2rem',
//       fontWeight: 700
//     }
//   }

// }

export const beachTheme = extendTheme(beachThemeOptions)
export const baseTheme = extendTheme(baseThemeOptions)

export const pageHeaderCSS = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '0 0 0.5rem 0'
}
