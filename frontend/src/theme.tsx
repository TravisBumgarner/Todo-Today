import React, { forwardRef } from 'react'
import { type LinkProps } from '@mui/material'
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom'
import { type ThemeOptions, css, experimental_extendTheme as extendTheme } from '@mui/material/styles'
import _ from 'lodash'
import { HEADER_HEIGHT } from './App/components/Header'

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
      color: 'var(--mui-palette-secondary-main)',
      fontSize: '1.7rem',
      fontWeight: 700,
      lineHeight: 1.35

    },
    h3: {
      color: 'var(--mui-palette-primary-main)',
      fontSize: '1.4rem',
      fontWeight: 400,
      lineHeight: 1.35
    },
    body1: {
      color: 'var(--mui-palette-text-primary)'
    },
    body2: {
      color: 'var(--mui-palette-text-primary)'
    }
  }
}

const beachThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#4c7da5'
    },
    secondary: {
      main: '#49beaa'
    },
    text: {
      primary: '#5c5e5f'
    },
    action: {
      disabled: '#616060'
    },
    background: {
      default: '#d7e3e8',
      paper: '#b8cbd2'
    },
    warning: {
      main: '#eeb868'
    },
    error: {
      main: '#ef767a'
    }
  }
}

const retroFutureThemeOptions = {
  palette: {
    primary: {
      main: '#7bc3ff'
    },
    secondary: {
      main: '#7bff7f'
    },
    text: {
      primary: '#efefef'
    },
    action: {
      disabled: '#767676'
    },
    background: {
      default: '#291543',
      paper: '#712a6b'
    },
    warning: {
      main: '#ffe93f'
    },
    error: {
      main: '#ff3f85'
    }
  }
}

const underTheSeaThemeOptions = {
  palette: {
    primary: {
      main: '#99c5c5'
    },
    secondary: {
      main: '#85FFC7'
    },
    text: {
      primary: '#dedede'
    },
    action: {
      disabled: '#EAE2B7'
    },
    background: {
      default: '#393a3a',
      paper: '#3e766f'
    },
    warning: {
      main: '#ffa052'
    },
    error: {
      main: '#ffc552'
    }
  }
}

const highContrastThemeOptions = {
  palette: {
    primary: {
      main: '#5669bc'
    },
    secondary: {
      main: '#4aab64'
    },
    text: {
      primary: '#000000'
    },
    action: {
      disabled: '#7e7e7e'
    },
    background: {
      default: '#ffffff',
      paper: '#e8e8e8'
    },
    warning: {
      main: '#eeb868'
    },
    error: {
      main: '#ef767a'
    }
  }
}

export const baseTheme = extendTheme(baseThemeOptions)
export const beachTheme = extendTheme(_.merge(baseThemeOptions, beachThemeOptions))
export const highContrastTheme = extendTheme(_.merge(baseThemeOptions, highContrastThemeOptions))
export const retroFutureTheme = extendTheme(_.merge(baseThemeOptions, retroFutureThemeOptions))
export const underTheSeaTheme = extendTheme(_.merge(baseThemeOptions, underTheSeaThemeOptions))

export const pageCSS = css`
  width:100%;
  height: calc(100vh - ${HEADER_HEIGHT}px);
`

