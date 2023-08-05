import React from 'react'
import styled from 'styled-components'
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
