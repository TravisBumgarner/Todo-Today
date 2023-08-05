import React from 'react'
import { Button, Typography } from '@mui/material'

import Modal from './Modal'

interface ConfirmationModalProps {
    title: string
    body: string
    confirmationCallback?: () => void
    cancelCallback?: () => void
    showModal: boolean
    setShowModal: (showModal: boolean) => void
}

const ConfirmationModal = ({ title, body, confirmationCallback, cancelCallback, showModal, setShowModal }: ConfirmationModalProps) => {
    return (
        <Modal
            title={title}
            showModal={showModal}
            closeModal={() => { setShowModal(false) }}
        >
            <Typography variant="body1">{body}</Typography>
            {cancelCallback && <Button key="cancel" onClick={cancelCallback}>Cancel</Button>}
            {confirmationCallback && <Button key="confirm" onClick={confirmationCallback}>Continue</Button>}
        </Modal>
    )
}

export default ConfirmationModal
