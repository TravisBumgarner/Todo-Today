import styled from 'styled-components'

import colors from './colors'

const H1 = styled.h1`
    color: ${colors.PRIMARY.base};
`

const H2 = styled.h2`
    color: ${colors.DARKNESS.base};
    padding: 1rem;
    border-radius: 1rem;
    margin-bottom: 3rem;
    background: rgb(106,127,219);
    background: linear-gradient(135deg, rgba(87,226,229,1) 0%,  rgba(106,127,219,1) 100%);
`

const H3 = styled.h3`
    color: ${colors.SECONDARY.base};
`

const H4 = styled.h4`
    color: ${colors.TERTIARY.base};
`

export { H1, H2, H3, H4 }
