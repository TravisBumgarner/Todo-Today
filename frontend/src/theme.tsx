import { createGlobalStyle } from 'styled-components'

import { TColor } from 'sharedTypes'

const GlobalStyle = createGlobalStyle<{theme: TColor}>`
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

export default { GlobalStyle }
