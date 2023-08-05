import React from 'react'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { Typography } from '@mui/material'

interface EmptyStateDisplayProps {
  message: string
  callToActionButton?: JSX.Element
}

const EmptyStateDisplayWrapper = styled.div`
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

const EmptyStateDisplay = ({ message, callToActionButton }: EmptyStateDisplayProps) => {
  return (
    <EmptyStateDisplayWrapper>
      <Typography variant="body1">
        {message}
      </Typography>
      {callToActionButton ?? ''}
    </EmptyStateDisplayWrapper>
  )
}

export default EmptyStateDisplay
