import React from 'react'
import styled from 'styled-components'

import { StyledNavLink } from 'sharedComponents'

const StyledNav = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0rem;
    display: flex;
    flex-direction: row;

    li {
        margin-right: 1rem;
    }
`

const ALWAYS_VISIBLE_LINKS = [
    { text: 'Todo List', to: '/' },
    { text: 'Projects', to: '/projects' },
    { text: 'Tasks by Project', to: '/tasks' },
    { text: 'Settings', to: '/settings' }
]

const Navigation = () => {
    return (
        <StyledNav >
            {ALWAYS_VISIBLE_LINKS.map(({ text, to }) => (
                <li key={to}>
                    <StyledNavLink addWeightForActiveLink to={to} text={text} />
                </li>
            ))}
        </StyledNav>
    )
}
export default Navigation
