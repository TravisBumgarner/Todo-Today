import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { useTheme } from '@mui/material/styles'
import { useMemo } from 'react'
import { GiPartyPopper } from 'react-icons/gi'
import { IoMdWarning } from 'react-icons/io'
import { IoInformationCircleOutline } from 'react-icons/io5'

const Message = ({
  message,
  color,
  callback,
  callbackText
}: {
  message: string
  color: 'info' | 'error' | 'success'
  callback?: () => void
  callbackText?: string
}) => {
  const theme = useTheme()

  const icon = useMemo(() => {
    if (color === 'error') {
      return <IoMdWarning size={30} color={theme.palette.info.main} />
    }
    if (color === 'success') {
      return <GiPartyPopper size={30} color={theme.palette.info.main} />
    }
    return <IoInformationCircleOutline size={30} color={theme.palette.info.main} />
  }, [color, theme])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        gap: '10px',
        margin: '20px 0'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box>{icon}</Box>
        <Typography sx={{ marginLeft: '8px' }} variant="h5" color={'info.main'}>
          {message}
        </Typography>
      </Box>
      {callback && (
        <Button variant="contained" color={color} onClick={callback}>
          {callbackText}
        </Button>
      )}
    </Box>
  )
}

export default Message
