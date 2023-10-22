import { Stack, css } from '@mui/material'

const ButtonWrapper = ({ children, isHorizontal }: { children: React.ReactNode, isHorizontal?: boolean }) => {
  return (
    <Stack mt={2} spacing={1} direction={isHorizontal ? 'row' : 'column'} css={wrapperCSS(isHorizontal)}>{children}</Stack>
  )
}

const wrapperCSS = (isHorizontal?: boolean) => css`
`

export default ButtonWrapper
