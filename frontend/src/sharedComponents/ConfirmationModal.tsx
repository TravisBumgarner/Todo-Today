import React from 'react'
import { Button, Typography } from '@mui/material'

import Modal from './Modal'
import ButtonWrapper from './ButtonWrapper'

interface ConfirmationModalProps {
    title: string
    body: string
    confirmationCallback?: () => void
    cancelCallback?: () => void
    showModal: boolean
    setShowModal: (showModal: boolean) => void
}

const ConfirmationModal = ({ title, body, confirmationCallback, cancelCallback, showModal, setShowModal }: ConfirmationModalProps) => {
    const Buttons = []

    if (cancelCallback) Buttons.push(<Button key="cancel" onClick={cancelCallback}>Cancel</Button>)
    if (confirmationCallback) Buttons.push(<Button key="confirm" onClick={confirmationCallback}>Continue</Button>)

    return (
        <Modal
            contentLabel={title}
            showModal={showModal}
            closeModal={() => { setShowModal(false) }}
        >
            <Typography variant="body1">{body}</Typography>
            <ButtonWrapper right={Buttons} />
        </Modal>
    )
}

export default ConfirmationModal
