import React from 'react'
import styled from 'styled-components'
import Button from './Button'

import Paragraph from './Paragraph'

type BigBoxOfNothingProps = {
    message: string
    callToActionButton?: JSX.Element
}

const BigBoxOfNothingWrapper = styled.div`
    border: 2px solid ${({ theme }) => theme.FOREGROUND};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem 0;
    flex-direction: column;

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
            {callToActionButton ? callToActionButton : ''}
        </BigBoxOfNothingWrapper>
    )
}

export default BigBoxOfNothing