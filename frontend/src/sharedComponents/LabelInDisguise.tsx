import styled from "styled-components"

const LabelInDisguise = styled.p`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${({ theme }) => theme.WARNING};
    margin: 0.5rem 0;
`

export default LabelInDisguise