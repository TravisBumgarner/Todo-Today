import React from 'react'
import { Button } from '@mui/material'

import Modal from './Modal'
import Paragraph from './Paragraph'
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
            <Paragraph>{body}</Paragraph>
            <ButtonWrapper right={Buttons} />
        </Modal>
    )
}

export default ConfirmationModal
