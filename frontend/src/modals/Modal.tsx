import React, { useContext, type FC, useCallback } from 'react'
import Box from '@mui/material/Box'
import MUIModal from '@mui/material/Modal'
import { Typography } from '@mui/material'
import { context } from 'Context'

interface ModalProps {
  children: any
  showModal: boolean
  title: string
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: '1rem',
  boxShadow: 24,
  p: 4
}

const Modal: FC<ModalProps> = ({ children, title }) => {
  const { dispatch } = useContext(context)

  const handleClose = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  return (
    <MUIModal
      open={true}
      onClose={handleClose}
    >
      <Box sx={style}>
        <Typography variant="h1">{title}</Typography>
        {children}
      </Box>
    </MUIModal>
  )
}

export default Modal
