import { createGlobalStyle } from 'styled-components'

import { TColor } from 'sharedTypes'

const GlobalStyle = createGlobalStyle<{theme: TColor}>`
    html {
        font-size: 14px;
        font-weight: 400;
        font-family: 'Roboto', sans-serif;
        background-color: ${({ theme }) => theme.BACKGROUND};
        margin: 0px auto;
        padding: 0;
        margin: 0 auto ©;
    }

    body {
        margin: 0;
        padding: 0;
    }

    p { 
        font-family: 'Roboto', sans-serif;
    }

    // table, button {
    //     border-radius: 10px !important;
    // }
`

export default { GlobalStyle }
