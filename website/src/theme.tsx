import {
  LinkProps,
  createTheme,
  css,
  type PaletteOptions
} from '@mui/material'
import { forwardRef } from 'react'
import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps
} from 'react-router-dom'

const paletteBase: Partial<PaletteOptions> = {
  primary: {
    main: 'rgb(76, 125, 165)'
  },
  secondary: {
    main: 'rgb(73, 190, 170)'
  },
  text: {
    primary: 'rgb(92, 94, 95)'
  },
  action: {
    disabled: 'rgb(97, 96, 96)'
  },
  background: {
    default: 'rgb(215, 227, 232)',
    paper: 'rgb(184, 203, 210)'
  },
  warning: {
    main: 'rgb(238, 184, 104)'
  },
  error: {
    main: 'rgb(239, 118, 122)'
  }
}

const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props
  return <RouterLink ref={ref} to={href} {...other} />
})
LinkBehavior.displayName = 'LinkBehavior'

export const theme = createTheme({
  palette: paletteBase,
  typography: {
    h2: {
      fontSize: '1.8rem',
      fontWeight: 700
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700
    },
    h4: {
      fontSize: '1.25rem',
    },
  },
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
})

export const pageWrapperCSS = css`
  box-sizing: border-box;
  overflow-y: auto;
  max-width: 1200px !important;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 2rem;
  margin-bottom: 2rem;
`
