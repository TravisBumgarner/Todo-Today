import { useCallback, useContext } from 'react'
import { Button, Typography } from '@mui/material'

import Modal from './Modal'
import { context } from 'Context'
import { type ModalID } from './LazyLoadModal'
import { ButtonWrapper } from 'sharedComponents'

export interface ConfirmationModalProps {
  id: ModalID
  title: string
  body: string
  confirmationCallback?: () => void
  cancelCallback?: () => void
}

const ConfirmationModal = ({ id, title, body, confirmationCallback, cancelCallback }: ConfirmationModalProps) => {
  const { dispatch } = useContext(context)

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  const handleConfirm = useCallback(() => {
    confirmationCallback?.()
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch, confirmationCallback])

  return (
    <Modal
      title={title}
      showModal={true}
    >
      <Typography variant="body1">{body}</Typography>
      <ButtonWrapper>
        <Button variant='contained'
          color="secondary" fullWidth onClick={handleCancel}>Cancel</Button>
        <Button variant='contained' fullWidth onClick={handleConfirm}>Ok</Button>
      </ButtonWrapper>
    </Modal >
  )
}

export default ConfirmationModal
