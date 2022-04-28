import React from 'react'
import styled from 'styled-components'
import Button from './Button'
import colors from './colors'

import Paragraph from './Paragraph'

type BigBoxOfNothingProps = {
    message: string
    callToAction?: {
        callback: () => void
        message: string
    }
}

const BigBoxOfNothingWrapper = styled.div`
    border: 2px solid ${colors.FOREGROUND_TEXT};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem 0;
`

const BigBoxOfNothing = ({ message, callToAction }: BigBoxOfNothingProps ) => {
    return (
        <BigBoxOfNothingWrapper>
            <Paragraph>
                {message}
                {callToAction ? <Button variation="PRIMARY_BUTTON" onClick={callToAction.callback}>{callToAction.message}</Button> : '' }
            </Paragraph>
        </BigBoxOfNothingWrapper>
    )
}

export default BigBoxOfNothing