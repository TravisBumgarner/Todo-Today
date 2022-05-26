import styled from 'styled-components'


const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0 1rem 0;
    height: 60px; // Magic Number because the Buttons on Today are messing things up
`

export default PageHeader
