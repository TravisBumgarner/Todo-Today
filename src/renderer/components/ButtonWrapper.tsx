import { Stack } from '@mui/material'

const ButtonWrapper = ({
  children,
}: {
  children: React.ReactNode
  isHorizontal?: boolean
}) => {
  return (
    <Stack mt={2} spacing={1} direction="row">
      {children}
    </Stack>
  )
}

export default ButtonWrapper
