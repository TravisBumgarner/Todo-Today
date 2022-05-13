import styled from 'styled-components'

const Divider = styled.div`
    width: 100%;
    border-bottom: 2px solid ${({ theme }) => theme.FOREGROUND};
    margin: 1rem 0;
`

export default Divider
