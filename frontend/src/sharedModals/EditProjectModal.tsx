import React, { useEffect, useState } from 'react'
import { Button, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'

import { Modal } from 'sharedComponents'
import { type TProject, EProjectStatus } from 'sharedTypes'
import { projectStatusLookup } from 'utilities'
import database from 'database'

interface EditProjectModalProps {
    projectId: TProject['id']
    showModal: boolean
    setShowModal: (showModal: boolean) => void
}

const EditProjectModal = ({ showModal, setShowModal, projectId }: EditProjectModalProps) => {
    const [title, setTitle] = useState<string>('')
    const [status, setStatus] = useState<EProjectStatus>(EProjectStatus.ACTIVE)
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const func = async () => {
            await database
                .projects.where('id').equals(projectId).first()
                .then((project: TProject) => {
                    setTitle(project.title)
                    setStatus(project.status)
                    setIsLoading(false)
                })
        }
        void func()
    }, [projectId])

    const handleSubmit = async () => {
        const editedProject = {
            title,
            status,
            id: projectId
        }
        await database.projects.put(editedProject, [projectId])
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
                        <form onChange={() => { setSubmitDisabled(false) }}>
                            <TextField
                                label="Title"
                                name="title"
                                value={title}
                                onChange={event => { setTitle(event.target.value) }}
                            />
                            <InputLabel id="project-status">Project Status</InputLabel>
                            <Select
                                labelId="project-status"
                                value={projectId}
                                label="Project Status"
                                onChange={(event) => { setStatus(event.target.value as EProjectStatus) }}
                            >
                                {Object.keys(EProjectStatus).map((key) => <MenuItem key={key} value={key}>{key}</MenuItem>)}
                            </Select>
                            <Button key="cancel" onClick={() => { setShowModal(false) }}>Cancel</Button>
                            <Button
                                key="save"
                                type="button"
                                disabled={submitDisabled}

                                onClick={handleSubmit}
                            >
                                Save
                            </Button>
                        </form>
                    )
            }

        </Modal>
    )
}

export default EditProjectModal
