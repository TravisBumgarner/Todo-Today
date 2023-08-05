import React from 'react'
import styled from 'styled-components'

interface ButtonWrapperProps {
    fullWidth?: JSX.Element
    left?: JSX.Element[]
    right?: JSX.Element[]
    vertical?: JSX.Element[]
}

const LeftRightWrapper = styled.div`
    display: flex;
    margin: 0.5rem 0;
    justify-content: space-between;

   div:nth-child(1) {
        text-align: left;
        button{
            margin-right: 0.5rem;
        }
        button:last-child{
            margin-right: 0rem;
        }
    }

    div:nth-child(2){
        text-align: right;
        button{
            margin-left: 0.5rem;
        }
        button:first-child{
            margin-left: 0rem;
        }
    }

`

const VerticalWrapper = styled.div`
    button{
        margin-bottom: 0.5rem;
    }
`

const ButtonWrapper = ({ left, right, fullWidth, vertical }: ButtonWrapperProps) => {
    let content

    if (left || right) {
        content = (
            <LeftRightWrapper>
                <div>{left}</div>
                <div>{right}</div>
            </LeftRightWrapper>
        )
    } else if (fullWidth) {
        content = (
            <div>
                {fullWidth}
            </div>
        )
    } else if (vertical) {
        content = (
            <VerticalWrapper>
                {vertical}
            </VerticalWrapper>
        )
    } else {
        return <p>Call it an easter egg.</p>
    }

    return content
}

export default ButtonWrapper
