import React from 'react'
import { Button } from '@mui/material'

import { Modal, LabelAndInput, Form } from 'sharedComponents'
import { type TTask, ETaskStatus } from 'sharedTypes'
import { taskStatusLookup } from 'utilities'
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

    React.useEffect(() => {
        database
            .tasks.where('id').equals(taskId).first()
            .then((t: TTask) => {
                setTitle(t.title)
                setProjectId(t.projectId)
                setStatus(t.status)
            })
    }, [])

    const handleSubmit = () => {
        const editedTask = {
            title,
            status,
            id: taskId,
            projectId
        }
        database.tasks.put(editedTask, [taskId])
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
            <Form onChange={() => { setFormEdited(true) }}>
                <LabelAndInput
                    label="Task"
                    name="title"
                    value={title}
                    handleChange={(value) => { setTitle(value) }}
                />
                <LabelAndInput
                    label="Status"
                    name="status"
                    value={status}
                    options={ETaskStatus}
                    optionLabels={taskStatusLookup}
                    inputType="select-enum"
                    handleChange={(value: ETaskStatus) => { setStatus(value) }}
                />
                <LabelAndInput
                    name="project"
                    value={projectId}
                    options={projectSelectOptions}
                    inputType="select-array"
                    label="Project"
                    handleChange={(value) => { setProjectId(value) }}
                />
                <Button key="cancel" onClick={() => { setShowModal(false) }}>Cancel</Button>
                <Button
                    type="button"
                    key="save"
                    disabled={!formEdited || projectId === ''}

                    onClick={handleSubmit}
                >
                    Save
                </Button>
            </Form>
        </Modal>
    )
}

export default EditTaskModal
