import React from 'react'

import { Button, Modal, ButtonWrapper, LabelAndInput } from 'sharedComponents'
import { TProject, TTask, TTaskStatus } from 'sharedTypes'

type EditTaskModalProps = {
    showModal: boolean
    project: TProject
    task: TTask
    setShowModal: (showModal: boolean) => void
    setTasks: React.Dispatch<React.SetStateAction<Record<string, TTask[]>>>
}

const EditTaskModal = ({ showModal, setShowModal, setTasks, project, task }: EditTaskModalProps) => {
    const [title, setTitle] = React.useState<string>(task.title)
    const [status, setStatus] = React.useState<TTaskStatus>(task.status)
    const [submitDisabled, setSubmitDisabled] = React.useState<boolean>(true)
    
    const handleSubmit = () => {
        const editedTask = {
            title,
            status,
            id: task.id,
            projectId: project.id
        }

        setTasks(prev => {
            const modifiedTasksArray = [...prev[project.id].filter(({ id }) => id !== task.id)]
            modifiedTasksArray.push(editedTask)
            const modifiedTasks = { ...prev, [project.id]: modifiedTasksArray }
            return modifiedTasks
        })
        setShowModal(false)
    }
    
    return (
        <Modal
            contentLabel={`Edit Task`}
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
             <form onChange={() => setSubmitDisabled(false)}>
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
                    options={TTaskStatus}
                    inputType="select"
                    handleChange={(status: TTaskStatus) => setStatus(status)}
                />
                <ButtonWrapper right={
                    [
                        <Button key="cancel" variation="FOREGROUND_PRIMARY" onClick={() => setShowModal(false)}>Cancel</Button>,
                        <Button key="save" disabled={submitDisabled} variation="FOREGROUND_ALERT" onClick={handleSubmit}>Save</Button>
                    ]
                }
                />
            </form>
        </Modal >
    )
}

export default EditTaskModal