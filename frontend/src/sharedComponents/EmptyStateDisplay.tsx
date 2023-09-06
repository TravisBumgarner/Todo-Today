import { Box, Typography, css } from '@mui/material'

interface EmptyStateDisplayProps {
  message: string
  callToActionButton?: JSX.Element
}

const EmptyStateDisplay = ({ message, callToActionButton }: EmptyStateDisplayProps) => {
  return (
    <Box css={wrapperCSS}>
      <Typography variant="body1">
        {message}
      </Typography>
      {callToActionButton ?? ''}
    </Box>
  )
}

const wrapperCSS = css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1.5rem 0;
    flex-direction: column;
    height: 100%;

    button {
        margin-bottom: 1rem;
    }

`

export default EmptyStateDisplay
