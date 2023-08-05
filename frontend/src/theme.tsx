import { createGlobalStyle } from 'styled-components'

import { type TColor } from 'sharedTypes'

import { css } from '@mui/material'

const GlobalStyle = createGlobalStyle<{ theme: TColor }>`
    html {
        font-size: 16px;
        font-weight: 400;
        font-family: 'Roboto', sans-serif;
        background-color: ${({ theme }) => theme.BACKGROUND};
        padding: 1em;
        max-width: 1200px;
        margin: 0px auto;
    }

    p { 
        font-family: 'Roboto', sans-serif;
    }
`

export const pageHeaderCSS = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 0 1rem 0',
    height: '60px'
}

export default { GlobalStyle }
