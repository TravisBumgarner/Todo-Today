import React from 'react'
import styled from 'styled-components'
import { transparentize } from 'polished'

import Paragraph from './Paragraph'

interface BigBoxOfNothingProps {
    message: string
    callToActionButton?: JSX.Element
}

const BigBoxOfNothingWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1.5rem 0;
    flex-direction: column;
    background-color: ${({ theme }) => transparentize(0.9, theme.FOREGROUND)};

    button {
        margin-bottom: 1rem;
    }
`

const BigBoxOfNothing = ({ message, callToActionButton }: BigBoxOfNothingProps) => {
    return (
        <BigBoxOfNothingWrapper>
            <Paragraph>
                {message}
            </Paragraph>
            {callToActionButton || ''}
        </BigBoxOfNothingWrapper>
    )
}

export default BigBoxOfNothing
