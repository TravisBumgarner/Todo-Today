import React, { useEffect } from 'react'
import { Button, InputLabel, MenuItem, Select, TextField } from '@mui/material'

import { Modal } from 'sharedComponents'
import { type TTask, ETaskStatus } from 'sharedTypes'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'

interface EditTaskModalProps {
    showModal: boolean
    taskId: TTask['id']
    setShowModal: (showModal: boolean) => void
}

const EditTaskModal = ({ showModal, setShowModal, taskId }: EditTaskModalProps) => {
    const [title, setTitle] = React.useState<string>('')
    const [status, setStatus] = React.useState<ETaskStatus>(ETaskStatus.NEW)
    const [projectId, setProjectId] = React.useState<string>('')
    const [formEdited, setFormEdited] = React.useState<boolean>(false)

    const projects = useLiveQuery(async () => {
        return await database.projects.toArray()
    }, [])

    useEffect(() => {
        void database
            .tasks.where('id').equals(taskId).first()
            .then((t: TTask) => {
                setTitle(t.title)
                setProjectId(t.projectId)
                setStatus(t.status)
            })
    }, [taskId])

    const handleSubmit = async () => {
        const editedTask = {
            title,
            status,
            id: taskId,
            projectId
        }
        await database.tasks.put(editedTask, [taskId])
        setShowModal(false)
    }

    const projectSelectOptions = projects ? projects.map(p => ({ value: p.id, label: p.title })) : []
    projectSelectOptions.unshift({ value: '', label: 'Select a Project' })

    return (
        <Modal
            contentLabel="Edit Task"
            showModal={showModal}
            closeModal={() => { setShowModal(false) }}
        >
            <form onChange={() => { setFormEdited(true) }}>
                <TextField
                    label="Task"
                    name="title"
                    value={title}
                    onChange={(event) => { setTitle(event.target.value) }}
                />
                <InputLabel id="task-status">Project</InputLabel>
                <Select
                    labelId="task-status"
                    value={status}
                    label="Status"
                    onChange={(event) => { setStatus(event.target.value as ETaskStatus) }}
                >
                    {Object.keys(ETaskStatus).map(key => <MenuItem key={key} value={key}>{key}</MenuItem>)}
                </Select>
                <Select
                    labelId="project-select"
                    id="demo-simple-select"
                    value={projectId}
                    label="Project"
                    onChange={(event) => { setProjectId(event.target.value) }}
                >
                    {projectSelectOptions.map(({ label, value }) => <MenuItem key={label} value={value}>{label}</MenuItem>)}
                </Select>
                <Button key="cancel" onClick={() => { setShowModal(false) }}>Cancel</Button>
                <Button
                    type="button"
                    key="save"
                    disabled={!formEdited || projectId === ''}

                    onClick={handleSubmit}
                >
                    Save
                </Button>
            </form>
        </Modal>
    )
}

export default EditTaskModal
