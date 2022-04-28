import { NavLink } from 'react-router-dom'
import React from 'react'
import styled from 'styled-components'

type StyledNavLinkProps = {
    to: string
    text: string
    addWeightForActiveLink?: boolean
}

const StyledNavLink = ({ to, text, addWeightForActiveLink }: StyledNavLinkProps) => {
    return (
        <NavLink
            style={({ isActive }) => ({
                fontWeight: addWeightForActiveLink && isActive ? 700 : 100,
            })}
            to={to}
        >
            {text}
        </NavLink>
    )
}

const DoubleStyledNavLink = styled(StyledNavLink)`
    color: ${(props) => {
        console.log(props)
        return `${props.theme.FOREGROUND_TEXT };`
    }}
`

export default DoubleStyledNavLink
