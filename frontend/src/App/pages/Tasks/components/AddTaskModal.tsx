import React from 'react'

import { Button, Modal, ButtonWrapper, LabelAndInput } from 'sharedComponents'
import { TProject, TTask, TTaskStatus } from 'sharedTypes'
import { context } from 'Context'

type AddTaskModalProps = {
    showModal: boolean
    project: TProject
    setShowModal: (showModal: boolean) => void
}

const AddTaskModal = ({ showModal, setShowModal, project }: AddTaskModalProps) => {
    const { dispatch } = React.useContext(context)

    const [title, setTitle] = React.useState<string>('')

    const handleSubmit = () => {
        const newTask = {
            title,
            status: TTaskStatus.NEW,
            id: `${Math.random()}`,
            projectId: project.id
        }

        dispatch({type: "ADD_TASK", payload: newTask})
        setShowModal(false)
    }

    return (
        <Modal
            contentLabel={`Add Task to ${project.title}`}
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            <>
                <LabelAndInput
                    label="Task"
                    name="title"
                    value={title}
                    handleChange={(data) => setTitle(data)}
                />
                <ButtonWrapper right={
                    [
                        <Button key="cancel" variation="PRIMARY_BUTTON" onClick={() => setShowModal(false)}>Cancel</Button>,
                        <Button disabled={title.length === 0} key="save" variation="ALERT_BUTTON" onClick={handleSubmit}>Save</Button>
                    ]
                }
                />
            </>
        </Modal >
    )
}

export default AddTaskModal