import React from 'react'

import { Button, Modal, ButtonWrapper, LabelAndInput, Form } from 'sharedComponents'
import { TProject, TTask, ETaskStatus } from 'sharedTypes'
import { projectStatusLookup } from 'utilities'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'

type EditTaskModalProps = {
    showModal: boolean
    taskId: TTask['id']
    setShowModal: (showModal: boolean) => void
}

const EditTaskModal = ({ showModal, setShowModal, taskId }: EditTaskModalProps) => {
    const [title, setTitle] = React.useState<string>('')
    const [status, setStatus] = React.useState<ETaskStatus>(ETaskStatus.NEW)
    const [projectId, setProjectId] = React.useState<string>('')
    const [submitDisabled, setSubmitDisabled] = React.useState<boolean>(true)

    const projects = useLiveQuery(async () => {
        return await database.projects.toArray()
    }, [])

    React.useEffect(() => {
        database
            .tasks.where('id').equals(taskId).first()
            .then(task => {
                const { title, status, projectId } = task as TTask
                setTitle(title)
                setProjectId(projectId)
                setStatus(status)
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

    const projectSelectOptions = projects ? projects.map(({ id, title }) => ({ value: id, label: title })) : []
    projectSelectOptions.unshift({ value: '', label: 'Select a Project' })


    return (
        <Modal
            contentLabel="Edit Task"
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            <Form onChange={() => setSubmitDisabled(false)}>
                <LabelAndInput
                    label="Task"
                    name="title"
                    value={title}
                    handleChange={(data) => setTitle(data)}
                />
                <LabelAndInput
                    label="Status"
                    name="status"
                    value={status}
                    options={ETaskStatus}
                    optionLabels={projectStatusLookup}
                    inputType="select-enum"
                    handleChange={(newStatus: ETaskStatus) => setStatus(newStatus)}
                />
                <LabelAndInput
                    name="project"
                    value={projectId}
                    options={projectSelectOptions}
                    inputType="select-array"
                    label="Project"
                    handleChange={(value) => setProjectId(value)}
                />
                <ButtonWrapper right={
                    [
                        <Button key="cancel" variation="INTERACTION" onClick={() => setShowModal(false)}>Cancel</Button>,
                        <Button type="button" key="save" disabled={submitDisabled} variation="WARNING" onClick={handleSubmit}>Save</Button>
                    ]
                }
                />
            </Form>
        </Modal>
    )
}

export default EditTaskModal
