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

const FunHeaderWrapper = styled.div`
    height: 4rem;
    position: relative;
   
    ${Heading.H1}{
        position: absolute;
        white-space: nowrap;
        opacity: 0.9;
        font-size: 4rem;
        letter-spacing: 6px;
    }

    ${Heading.H1}:nth-child(1){
        left: -2px;
        top: -2px;
        opacity: 0.8;
        color: ${({ theme }) => theme.FOREGROUND};
    }

    ${Heading.H1}:nth-child(2){
        left: 2px;
        top: 2px;
        opacity: 0.8;
        color: ${({ theme }) => theme.INTERACTION};
    }

    ${Heading.H1}:nth-child(3){
        left: -2px;
        top: 2px;
        opacity: 0.8;
        color: ${({ theme }) => theme.DISABLED};
    }

    ${Heading.H1}:nth-child(4){
        left: 2px;
        top: -2px;
        opacity: 0.8;
        color: ${({ theme }) => theme.WARNING};
    }

    ${Heading.H1}:nth-child(5){
        left: 0px;
        top: 0px;
        color: ${({ theme }) => theme.BACKGROUND};
    }
`

const FunHeader = () => {
    return (
        <FunHeaderWrapper>
            <Heading.H1>
                TODO TODAY
            </Heading.H1>
            <Heading.H1>
                TODO TODAY
            </Heading.H1>
            <Heading.H1>
                TODO TODAY
            </Heading.H1>
            <Heading.H1>
                TODO TODAY
            </Heading.H1>
            <Heading.H1>
                TODO TODAY
            </Heading.H1>
        </FunHeaderWrapper>
    )
}

const Header = () => {
    return (
        <HeaderWrapper>
            <div>
                <Link style={{ textDecoration: 'none' }} to="/">
                    <FunHeader />
                </Link>
            </div>
        </HeaderWrapper>
    )
}

export default Header
