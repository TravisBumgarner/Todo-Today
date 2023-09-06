import { Box, css } from '@mui/material'

// Expecs full width buttons as children
const ButtonWrapper = ({ children }: any) => {
  return (
    <Box css={wrapperCSS}>{children}</Box>
  )
}

const wrapperCSS = css`
  button {
    margin: 0.5rem 0;
  }
`

export default ButtonWrapper
