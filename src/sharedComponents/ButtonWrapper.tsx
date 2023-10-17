import { Box, css } from '@mui/material'

const ButtonWrapper = ({ children, isHorizontal }: { children: React.ReactNode, isHorizontal?: boolean }) => {
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

    :last-child{
      margin-right: 0;
    }
    
  }
`

export default ButtonWrapper
