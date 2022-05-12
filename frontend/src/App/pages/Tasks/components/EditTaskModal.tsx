import React from 'react'

import { Button, Modal, ButtonWrapper, LabelAndInput, Form } from 'sharedComponents'
import { TProject, TTask, ETaskStatus } from 'sharedTypes'
import { projectStatusLookup } from 'utilities'
import database from 'database'

type EditTaskModalProps = {
    showModal: boolean
    project: TProject
    task: TTask
    setShowModal: (showModal: boolean) => void
}

const EditTaskModal = ({ showModal, setShowModal, project, task }: EditTaskModalProps) => {
    const [title, setTitle] = React.useState<string>(task.title)
    const [status, setStatus] = React.useState<ETaskStatus>(task.status)
    const [submitDisabled, setSubmitDisabled] = React.useState<boolean>(true)

    const handleSubmit = () => {
        const editedTask = {
            title,
            status,
            id: task.id,
            projectId: project.id
        }
        database.tasks.put(editedTask, [task.id])
        setShowModal(false)
    }

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
                <ButtonWrapper right={
                    [
                        <Button key="cancel" variation="PRIMARY_BUTTON" onClick={() => setShowModal(false)}>Cancel</Button>,
                        <Button type="button" key="save" disabled={submitDisabled} variation="ALERT_BUTTON" onClick={handleSubmit}>Save</Button>
                    ]
                }
                />
            </Form>
        </Modal>
    )
}

export default EditTaskModal
