import React, { useCallback, useContext } from 'react'
import { Button, Typography } from '@mui/material'

import Modal from '../modals/Modal'
import { context } from 'Context'

interface ConfirmationModalProps {
  title: string
  body: string
  confirmationCallback?: () => void
}

const ConfirmationModal = ({ title, body, confirmationCallback }: ConfirmationModalProps) => {
  const { dispatch } = useContext(context)

  const handleClick = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  return (
    <Modal
      title={title}
      showModal={true}
    >
      <Typography variant="body1">{body}</Typography>
      <Button key="cancel" onClick={handleClick}>Cancel</Button>
      {confirmationCallback && <Button key="confirm" onClick={confirmationCallback}>Continue</Button>}
    </Modal>
  )
}

export default ConfirmationModal
