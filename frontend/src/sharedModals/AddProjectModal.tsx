import React from 'react'
import { v4 as uuid4 } from 'uuid'
import { Button, TextField } from '@mui/material'

import database from 'database'
import { Modal } from 'sharedComponents'
import { type TProject, EProjectStatus } from 'sharedTypes'

interface AddProjectModalProps {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
}

const AddProjectModal = ({ showModal, setShowModal }: AddProjectModalProps) => {
    const [title, setTitle] = React.useState<string>('')

    const handleSubmit = async () => {
        const newProject: TProject = {
            id: uuid4(),
            title,
            status: EProjectStatus.ACTIVE
        }
        await database.projects.add(newProject)
        setShowModal(false)
    }

    return (
        <Modal
            contentLabel="Add New Project"
            showModal={showModal}
            closeModal={() => { setShowModal(false) }}
        >
            <form>
                <TextField
                    label="Title"
                    name="title"
                    value={title}
                    onChange={(event) => { setTitle(event.target.value) }}
                    fullWidth
                />
                <Button fullWidth key="cancel" onClick={() => { setShowModal(false) }}>Cancel</Button>
                <Button
                    fullWidth
                    variant='contained'
                    key="save"
                    type="button"
                    disabled={title.length === 0}

                    onClick={handleSubmit}
                >
                    Save
                </Button>
            </form>
        </Modal>
    )
}

export default AddProjectModal
