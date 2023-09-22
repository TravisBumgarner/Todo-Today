import { Box, css } from '@mui/material'
import { type ReactElement } from 'react'

// Expects full width buttons as children
const ButtonWrapper = ({ children }: { children: ReactElement | ReactElement[] }) => {
  return (
    <Box css={wrapperCSS}>{children}</Box>
  )
}

const wrapperCSS = css`
  width: 100%;

  button {
    margin: 0.5rem 0;
  }
`

export default ButtonWrapper
