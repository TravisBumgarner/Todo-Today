import React, { forwardRef } from 'react'
import { type LinkProps } from '@mui/material'
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom'
import { type ThemeOptions, css, experimental_extendTheme as extendTheme } from '@mui/material/styles'
import _ from 'lodash'

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
      fontSize: '1.2rem',
      fontWeight: 700,
      color: 'var(--mui-palette-background-default)'
    },
    body1: {
      color: 'var(--mui-palette-secondary-main)'
    },
    body2: {
      color: 'var(--mui-palette-secondary-main)'
    }
  }
}

const beachThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#7bc3ff'
    },
    secondary: {
      main: '#49beaa'
    },
    text: {
      primary: '#294460'
    },
    action: {
      disabled: '#d6d6d6'
    },
    background: {
      default: '#294460',
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

const retroFutureThemeOptions = {
  palette: {
    primary: {
      main: '#7bc3ff'
    },
    secondary: {
      main: '#7bff7f'
    },
    text: {
      primary: '#767676'
    },
    action: {
      disabled: '#767676'
    },
    background: {
      default: '#1b1b1b',
      paper: '#767676'
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
      main: '#81ffff'
    },
    secondary: {
      main: '#85FFC7'
    },
    text: {
      primary: '#39393A'
    },
    action: {
      disabled: '#EAE2B7'
    },
    background: {
      default: '#39393A',
      paper: '#39393A'
    },
    warning: {
      main: '#ffd552'
    },
    error: {
      main: '#ff6f52'
    }
  }
}

const highContrastThemeOptions = {
  palette: {
    primary: {
      main: '#404040'
    },
    secondary: {
      main: '#353535'
    },
    text: {
      primary: '#000000'
    },
    action: {
      disabled: '#7e7e7e'
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff'
    },
    warning: {
      main: '#a89704'
    },
    error: {
      main: '#871717'
    }
  }
}

export const baseTheme = extendTheme(baseThemeOptions)
export const beachTheme = extendTheme(_.merge(baseThemeOptions, beachThemeOptions))
export const highContrastTheme = extendTheme(_.merge(baseThemeOptions, highContrastThemeOptions))
export const retroFutureTheme = extendTheme(_.merge(baseThemeOptions, retroFutureThemeOptions))
export const underTheSeaTheme = extendTheme(_.merge(baseThemeOptions, underTheSeaThemeOptions))

export const pageHeaderCSS = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 0.5rem 0;
  width: 100%;
`

export const pageCSS = css`
  width:100%;
`
