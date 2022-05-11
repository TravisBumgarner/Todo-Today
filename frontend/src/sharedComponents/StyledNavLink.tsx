import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const StyledNavLink = styled(NavLink)`
    color: ${(props) => {
        return props.theme.PRIMARY_BUTTON
    }};

    &:hover {
        color: ${(props) => {
        return props.theme.ALERT_BUTTON
    }};
    }

`

export default StyledNavLink
