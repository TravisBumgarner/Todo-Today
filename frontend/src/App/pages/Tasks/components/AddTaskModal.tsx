import React from 'react'
import { v4 as uuid4 } from 'uuid'

import { Button, Modal, ButtonWrapper, LabelAndInput } from 'sharedComponents'
import { TProject, TTask, TTaskStatus } from 'sharedTypes'
// import { context } from 'Context'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'

type AddTaskModalProps = {
    showModal: boolean
    project: TProject
    setShowModal: (showModal: boolean) => void
}

const AddTaskModal = ({ showModal, setShowModal, project }: AddTaskModalProps) => {
    // const { dispatch } = React.useContext(context)

    const [title, setTitle] = React.useState<string>('')

    const handleSubmit = () => {
        const newTask = {
            title,
            status: TTaskStatus.NEW,
            id: uuid4(),
            projectId: project.id
        }
        database.tasks.add(newTask)
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