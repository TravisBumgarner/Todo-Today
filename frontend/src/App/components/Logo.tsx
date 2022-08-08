import React from 'react'
import styled from 'styled-components'

import { Heading } from 'sharedComponents'

const Wrapper = styled.div`
    position: relative;
   
    ${Heading.H1}{
        white-space: nowrap;
        opacity: 0.9;
        font-size: 2rem;
        letter-spacing: 4px;
    }

    ${Heading.H1}:nth-child(1){
        position: absolute;
        left: -1px;
        top: -1px;
        opacity: 0.8;
        color: ${({ theme }) => theme.FOREGROUND};
    }

    ${Heading.H1}:nth-child(2){
        position: absolute;
        left: 1px;
        top: 1px;
        opacity: 0.8;
        color: ${({ theme }) => theme.INTERACTION};
    }

    ${Heading.H1}:nth-child(3){
        position: absolute;
        left: -1px;
        top: 1px;
        opacity: 0.8;
        color: ${({ theme }) => theme.DISABLED};
    }

    ${Heading.H1}:nth-child(4){
        position: absolute;
        left: 1px;
        top: -1px;
        opacity: 0.8;
        color: ${({ theme }) => theme.WARNING};
    }

    ${Heading.H1}:nth-child(5){
        left: 0px;
        top: 0px;
        color: ${({ theme }) => theme.BACKGROUND};
    }
`

const Logo = () => {
    return (
        <Wrapper>
            <Heading.H1>
                Todo Today
            </Heading.H1>
            <Heading.H1>
                Todo Today
            </Heading.H1>
            <Heading.H1>
                Todo Today
            </Heading.H1>
            <Heading.H1>
                Todo Today
            </Heading.H1>
            <Heading.H1>
                Todo Today
            </Heading.H1>
        </Wrapper>
    )
}

export default Logo
