import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const StyledNavLink = styled(NavLink)`
    color: ${(props) => {
        return props.theme.FOREGROUND
    }};

    &:hover {
        color: ${(props) => {
        return props.theme.INTERACTION
    }};
    }

`

export default StyledNavLink
