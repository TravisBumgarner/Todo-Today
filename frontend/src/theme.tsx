import React, { forwardRef } from 'react'
import { type LinkProps } from '@mui/material'
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom'
import { css, experimental_extendTheme as extendTheme } from '@mui/material/styles'

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
      color: 'var(--mui-palette-error-main)'
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 400,
      lineHeight: 1.35,
      color: 'var(--mui-palette-error-main)'
    },
    h4: {
      fontSize: '1.4rem',
      fontWeight: 400,
      lineHeight: 1.35,
      color: 'var(--mui-palette-secondary-main)'
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
      main: '#49beaa'
    },
    background: {
      default: '#456990',
      paper: '#517dab'
    },
    warning: {
      main: '#eeb868'
    },
    error: {
      main: '#ef767a'
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
export const pageHeaderCSS = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 0.5rem 0;
  width: 100%;
`

export const pageCSS = css`
  width: 100%;
`
