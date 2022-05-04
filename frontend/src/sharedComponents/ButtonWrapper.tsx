import React from 'react'
import styled from 'styled-components'
import Button from './Button'

type ButtonWrapperProps = {
    fullWidth?: JSX.Element
    left?: JSX.Element[]
    right?: JSX.Element[]
}

const ButtonWrapperWrapper = styled.div`
    display: flex;
    margin: 2rem 0;

    justify-content: space-between;

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

const ButtonWrapper = ({ left, right, fullWidth }: ButtonWrapperProps) => {
    return (
        <ButtonWrapperWrapper>
            {fullWidth
                ? fullWidth 
                : <>
                    <div>{left}</div>
                    <div>{right}</div>
                </>

            }

        </ButtonWrapperWrapper>
    )
}

export default ButtonWrapper
