import React from 'react'
import moment, { Moment } from 'moment'
import { v4 as uuid4 } from 'uuid'

import database from 'database'
import { Button, Modal, ButtonWrapper, LabelAndInput, Form } from 'sharedComponents'
import { TProject, EProjectStatus } from 'sharedTypes'
import { formatDateKeyLookup, projectStatusLookup } from 'utilities'

type AddProjectModalProps = {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
}

const AddProjectModal = ({ showModal, setShowModal }: AddProjectModalProps) => {
    const [title, setTitle] = React.useState<string>('')
    const [status, setStatus] = React.useState<EProjectStatus>(EProjectStatus.ACTIVE)

    const handleSubmit = async () => {
        const newProject: TProject = {
            id: uuid4(),
            title,
            status,
        }
        await database.projects.add(newProject)
        setShowModal(false)
    }

    return (
        <Modal
            contentLabel="Add New Project"
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            <Form>
                <LabelAndInput
                    label="Title"
                    name="title"
                    value={title}
                    handleChange={(data) => setTitle(data)}
                />
                <LabelAndInput
                    label="Status"
                    name="status"
                    value={status}
                    options={EProjectStatus}
                    optionLabels={projectStatusLookup}
                    inputType="select-enum"
                    handleChange={(newStatus: EProjectStatus) => setStatus(newStatus)}
                />
                <ButtonWrapper right={
                    [
                        <Button key="cancel" variation="WARNING" onClick={() => setShowModal(false)}>Cancel</Button>,
                        <Button
                            key="save"
                            type="button"
                            disabled={title.length === 0}
                            variation="INTERACTION"
                            onClick={handleSubmit}
                        >
                            Save
                        </Button>
                    ]
                }
                />
            </Form>
        </Modal>
    )
}

export default AddProjectModal
