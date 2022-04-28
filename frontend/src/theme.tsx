import { createGlobalStyle } from 'styled-components'

import { TThemeConstants } from 'sharedTypes'

const GlobalStyle = createGlobalStyle<{theme: TThemeConstants}>`
    html {
        font-size: 16px;
        font-weight: 400;
        font-family: 'Roboto', sans-serif;
        background-color: ${({theme}) => theme.BACKGROUND_PRIMARY };
        padding: 1em;
        max-width: 1200px;
        margin: 0px auto;
    }
`

export default { GlobalStyle }
