import * as React from 'react'
import Box from '@mui/material/Box'
import MUIModal from '@mui/material/Modal'
import { Typography } from '@mui/material'

interface ModalProps {
    children: any
    showModal: boolean
    closeModal: () => void
    title: string
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
}

const Modal: React.FC<ModalProps> = ({ closeModal, showModal, children, title }) => {
    const handleClose = React.useCallback(() => {
        closeModal()
    }, [closeModal])

    return (
        <MUIModal
            open={showModal}
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
