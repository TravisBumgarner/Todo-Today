import React from 'react'
import { Button, Typography } from '@mui/material'

import { Modal, ButtonWrapper, LabelAndInput, Form } from 'sharedComponents'
import { type TProject, EProjectStatus } from 'sharedTypes'
import { projectStatusLookup } from 'utilities'
import database from 'database'

interface EditProjectModalProps {
    projectId: TProject['id']
    showModal: boolean
    setShowModal: (showModal: boolean) => void
}

const EditProjectModal = ({ showModal, setShowModal, projectId }: EditProjectModalProps) => {
    const [title, setTitle] = React.useState<string>('')
    const [status, setStatus] = React.useState<EProjectStatus>(EProjectStatus.ACTIVE)
    const [submitDisabled, setSubmitDisabled] = React.useState<boolean>(true)
    const [isLoading, setIsLoading] = React.useState<boolean>(true)

    React.useEffect(() => {
        database
            .projects.where('id').equals(projectId).first()
            .then((project: TProject) => {
                setTitle(project.title)
                setStatus(project.status)
                setIsLoading(false)
            })
    }, [])

    const handleSubmit = () => {
        const editedProject = {
            title,
            status,
            id: projectId
        }
        database.projects.put(editedProject, [projectId])
        setShowModal(false)
    }

    return (
        <Modal
            contentLabel="Edit Project"
            showModal={showModal}
            closeModal={() => { setShowModal(false) }}
        >
            {
                isLoading
                    ? <Typography variant="body1">One sec</Typography>
                    : (
                        <Form onChange={() => { setSubmitDisabled(false) }}>
                            <LabelAndInput
                                label="Title"
                                name="title"
                                value={title}
                                handleChange={(data) => { setTitle(data) }}
                            />
                            <LabelAndInput
                                label="Status"
                                name="status"
                                value={status}
                                options={EProjectStatus}
                                optionLabels={projectStatusLookup}
                                inputType="select-enum"
                                handleChange={(newStatus: EProjectStatus) => { setStatus(newStatus) }}
                            />
                            <ButtonWrapper right={
                                [
                                    <Button key="cancel" onClick={() => { setShowModal(false) }}>Cancel</Button>,
                                    <Button
                                        key="save"
                                        type="button"
                                        disabled={submitDisabled}

                                        onClick={handleSubmit}
                                    >
                                        Save
                                    </Button>
                                ]
                            }
                            />
                        </Form>
                    )
            }

        </Modal>
    )
}

export default EditProjectModal
