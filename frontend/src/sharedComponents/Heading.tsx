import styled from 'styled-components'

const H1 = styled.h1`
    color: ${({theme}) => theme.FOREGROUND_TEXT };
`

const H2 = styled.h2`
    color: ${({theme}) => theme.FOREGROUND_TEXT };
    margin: 1rem 0;
`

const H3 = styled.h3`
    color: ${({theme}) => theme.FOREGROUND_TEXT };
`

export { H1, H2, H3 }
