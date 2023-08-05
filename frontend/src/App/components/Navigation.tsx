import React from 'react'
import styled from 'styled-components'
import { NavLink, useLocation } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import SettingsIcon from '@mui/icons-material/Settings'

const StyledNav = styled.ul`
    list-style: none;
    margin: 2rem 0;
    padding: 0rem;
    display: flex;
    flex-direction: row;

    li {
        margin-left: 1rem;
    }
`

const ALWAYS_VISIBLE_LINKS = [
    { text: <EditIcon name="edit" />, to: '/history' },
    { text: <SettingsIcon name="settings" />, to: '/settings' }
]

const NavLi = styled.li`
    font-weight: ${(props: { isActive: boolean }) => {
        return props.isActive ? 700 : 100
    }};
`

const Navigation = () => {
    const location = useLocation()
    return (
        <StyledNav>
            {ALWAYS_VISIBLE_LINKS.map(({ text, to }) => (
                <NavLi key={to} isActive={location.pathname === to}>
                    <NavLink to={to}>{text}</NavLink>
                </NavLi>
            ))}
        </StyledNav>
    )
}
export default Navigation
