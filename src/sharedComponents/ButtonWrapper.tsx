import { Box, css } from '@mui/material'
import { type ReactElement } from 'react'

const ButtonWrapper = ({ children, isHorizontal }: { children: ReactElement | ReactElement[], isHorizontal?: boolean }) => {
  return (
    <Box css={wrapperCSS(isHorizontal)}>{children}</Box>
  )
}

const wrapperCSS = (isHorizontal?: boolean) => css`
  width: 100%;
  ${isHorizontal && 'display: flex; justify-content: space-between;'}

  button {
    margin: 0.5rem 0;
    ${isHorizontal && 'margin-right: 0.5rem'};
    ${isHorizontal && 'flex-grow:1'};
    
  }
`

export default ButtonWrapper
