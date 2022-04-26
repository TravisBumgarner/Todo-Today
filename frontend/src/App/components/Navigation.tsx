import React from 'react'
import styled from 'styled-components'

import { StyledNavLink } from 'sharedComponents'

const StyledNav = styled.ul`
    list-style: none;
    margin: 0;
    padding: 1rem;

    li {
        padding: 10px;
    }
`

const ALWAYS_VISIBLE_LINKS = [
    { text: 'Today', to: '/' },
    { text: 'Projects', to: '/projects' },
    { text: 'Tasks by Project', to: '/tasks' },
]

const Navigation = () => {
    return (
        <div style={{ position: 'relative' }}>
            <StyledNav >
                {ALWAYS_VISIBLE_LINKS.map(({ text, to }) => (
                    <li key={to}>
                        <StyledNavLink addWeightForActiveLink to={to} text={text} />
                    </li>
                ))}
            </StyledNav>
        </div>
    )
}
export default Navigation
