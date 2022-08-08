import React from 'react'
import styled from 'styled-components'
import { transparentize } from 'polished'

import Button from './Button'
import Paragraph from './Paragraph'

type BigBoxOfNothingProps = {
    message: string
    callToActionButton?: JSX.Element
}

const BigBoxOfNothingWrapper = styled.div`
    border: 1px solid ${({ theme }) => theme.FOREGROUND};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1.5rem 0;
    flex-direction: column;
    background-color: ${({ theme }) => transparentize(0.9, theme.FOREGROUND)};

    ${Button}{
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
