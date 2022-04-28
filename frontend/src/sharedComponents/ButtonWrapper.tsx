import React from 'react'
import styled from 'styled-components'
import Button from './Button'

type ButtonWrapperProps = {
    left?: JSX.Element[]
    right?: JSX.Element[]
}

const ButtonWrapperWrapper = styled.div`
    display: flex;

    div {
        width: calc(100% / 2);
    }

    div:nth-child(1) {
        text-align: left;
        ${Button}{
            margin-right: 0.5rem;
        }
    }

    div:nth-child(2){
        text-align: right;
        ${Button}{
            margin-left: 0.5rem;
        }
    }

`

const ButtonWrapper = ({ left, right }: ButtonWrapperProps) => {
    return (
        <ButtonWrapperWrapper>
            <div>{left}</div>
            <div>{right}</div>
        </ButtonWrapperWrapper>
    )
}

export default ButtonWrapper
