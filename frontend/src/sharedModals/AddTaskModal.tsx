import React from 'react'
import { v4 as uuid4 } from 'uuid'

import { Button, Modal, ButtonWrapper, LabelAndInput, Form } from 'sharedComponents'
import { TProject, ETaskStatus } from 'sharedTypes'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'

type AddTaskModalProps = {
    showModal: boolean
    project?: TProject
    setShowModal: (showModal: boolean) => void
}

const AddTaskModal = ({ showModal, setShowModal, project }: AddTaskModalProps) => {
    const [title, setTitle] = React.useState<string>('')
    const [projectId, setProjectId] = React.useState<TProject['id'] | ''>(project ? project.id : '')

    const projects = useLiveQuery(async () => {
        return await database.projects.toArray()
    }, [])

    const handleSubmit = () => {
        const newTask = {
            title,
            status: ETaskStatus.NEW,
            id: uuid4(),
            projectId
        }
        database.tasks.add(newTask)
        setShowModal(false)
    }

    const projectSelectOptions = projects ? projects.map(({ id, title }) => ({ value: id, label: title })) : []
    projectSelectOptions.unshift({value: '', label: 'Select a Project'})

    return (
        <Modal
            contentLabel={`Add Task`}
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            <Form>
                <LabelAndInput
                    label="Task"
                    name="title"
                    value={title}
                    handleChange={(data) => setTitle(data)}
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
                        <Button key="cancel" variation="WARNING" onClick={() => setShowModal(false)}>Cancel</Button>,
                        <Button disabled={title.length === 0 || projectId.length === 0} key="save" variation="INTERACTION" onClick={handleSubmit}>Save</Button>
                    ]
                }
                />
            </Form>
        </Modal>
    )
}

export default AddTaskModal
