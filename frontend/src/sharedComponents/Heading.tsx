import styled from 'styled-components'

const H1 = styled.h1`
    color: ${({ theme }) => theme.WARNING};
    margin: 0;
`

const H2 = styled.h2`
    color: ${({ theme }) => theme.WARNING};
    margin: 1.5rem 0 1rem 0;
`

const H3 = styled.h3`
    color: ${({ theme }) => theme.WARNING};
`

const H4 = styled.h4`
    color: ${({ theme }) => theme.WARNING};
`

export { H1, H2, H3, H4 }
