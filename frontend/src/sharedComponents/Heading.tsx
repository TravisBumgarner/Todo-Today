import styled from 'styled-components'

const H1 = styled.h1`
    color: ${({ theme }) => theme.WARNING};
    margin: 0;
    font-size: 1rem;
    font-family: 'Comfortaa', cursive;
`

const H2 = styled.h2`
    color: ${({ theme }) => theme.WARNING};
    margin: 0;
    font-size: 2.5rem;
    font-family: 'Comfortaa', cursive;
`

const H3 = styled.h3`
    color: ${({ theme }) => theme.WARNING};
    margin: 1.5rem 0;
    font-size: 1.8rem;
    font-family: 'Comfortaa', cursive;
`

const H4 = styled.h4`
    color: ${({ theme }) => theme.WARNING};
    margin: 0.75rem 0;
    font-family: 'Comfortaa', cursive;
`

export { H1, H2, H3, H4 }
