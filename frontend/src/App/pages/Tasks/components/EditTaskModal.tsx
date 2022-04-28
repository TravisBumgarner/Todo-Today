import { context } from 'Context'
import React from 'react'

import { Button, Modal, ButtonWrapper, LabelAndInput } from 'sharedComponents'
import { TProject, TTask, TTaskStatus } from 'sharedTypes'

type EditTaskModalProps = {
    showModal: boolean
    project: TProject
    taskId: TTask['id']
    setShowModal: (showModal: boolean) => void
}

const EditTaskModal = ({ showModal, setShowModal, project, taskId }: EditTaskModalProps) => {
    const { dispatch, state } = React.useContext(context)

    const task = state.tasks[taskId]

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

        dispatch({type: "EDIT_TASK", payload: editedTask})
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
                        <Button key="cancel" variation="PRIMARY_BUTTON" onClick={() => setShowModal(false)}>Cancel</Button>,
                        <Button key="save" disabled={submitDisabled} variation="ALERT_BUTTON" onClick={handleSubmit}>Save</Button>
                    ]
                }
                />
            </form>
        </Modal >
    )
}

export default EditTaskModal