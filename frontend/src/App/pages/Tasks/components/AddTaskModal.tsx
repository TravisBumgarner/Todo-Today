import React from 'react'
import moment, { Moment } from 'moment'

import { Button, DropdownMenu, Table, Heading, Modal, ButtonWrapper, LabelAndInput } from 'sharedComponents'
import { TProject, TTask, TTaskStatus } from 'sharedTypes'

type AddTaskModalProps = {
    showModal: boolean
    project: TProject
    setShowModal: (showModal: boolean) => void
    setTasks: React.Dispatch<React.SetStateAction<Record<string, TTask[]>>>
}

const AddTaskModal = ({ showModal, setShowModal, setTasks, project }: AddTaskModalProps) => {
    const [title, setTitle] = React.useState<string>('')

    const handleSubmit = () => {
        const newTask = {
            title,
            status: TTaskStatus.NEW,
            id: `${Math.random()}`,
            projectId: project.id
        }

        setTasks(prev => {
            const modifiedTasks = { ...prev } 
            modifiedTasks[project.id].push(newTask)
            return modifiedTasks
        })
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
                        <Button key="cancel" variation="FOREGROUND_PRIMARY" onClick={() => setShowModal(false)}>Cancel</Button>,
                        <Button key="save" variation="FOREGROUND_ALERT" onClick={handleSubmit}>Save</Button>
                    ]
                }
                />
            </>
        </Modal >
    )
}

export default AddTaskModal