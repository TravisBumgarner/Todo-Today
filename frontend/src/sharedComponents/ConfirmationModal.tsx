import React from 'react'

import Modal from './Modal'
import Button from './Button'
import Paragraph from './Paragraph'
import ButtonWrapper from './ButtonWrapper'

type ConfirmationModalProps = {
    title: string
    body: string
    confirmationCallback?: () => void
    cancelCallback?: () => void
    showModal: boolean
    setShowModal: (showModal: boolean) => void
}

const ConfirmationModal = ({ title, body, confirmationCallback, cancelCallback, showModal, setShowModal }: ConfirmationModalProps) => {
    const Buttons = []

    if (cancelCallback) Buttons.push(<Button key="cancel" variation="ALERT_BUTTON" onClick={cancelCallback}>Cancel</Button>)
    if (confirmationCallback) Buttons.push(<Button key="confirm" variation="PRIMARY_BUTTON" onClick={confirmationCallback}>Continue</Button>)

    return (
        <Modal
            contentLabel={title}
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            <Paragraph>{body}</Paragraph>
            <ButtonWrapper right={Buttons} />
        </Modal>
    )
}

export default ConfirmationModal
