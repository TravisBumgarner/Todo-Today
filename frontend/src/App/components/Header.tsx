import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { Heading } from 'sharedComponents'

const HeaderWrapper = styled.div`
    display:flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
`

const Header = () => {
    return (
        <HeaderWrapper>
            <div>
                <Link style={{ textDecoration: 'none' }} to="/">
                    <Heading.H1>
                        Todo Today
                    </Heading.H1>
                </Link>
            </div>
        </HeaderWrapper>
    )
}

export default Header
