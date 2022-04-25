import { NavLink } from 'react-router-dom'
import React from 'react'

import colors from './colors'

type StyledNavLinkProps = {
    to: string
    text: string
    addWeightForActiveLink?: boolean
    color?: string
}

const StyledNavLink = ({ to, text, addWeightForActiveLink, color }: StyledNavLinkProps) => {
    return (
        <NavLink
            style={({ isActive }) => ({
                fontWeight: addWeightForActiveLink && isActive ? 700 : 100,
                color: color || colors.PRIMARY,
            })}
            to={to}
        >
            {text}
        </NavLink>
    )
}

export default StyledNavLink
