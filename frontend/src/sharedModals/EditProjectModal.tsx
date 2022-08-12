import React from 'react'
import moment, { Moment } from 'moment'

import { Button, Modal, ButtonWrapper, LabelAndInput, Form, Paragraph } from 'sharedComponents'
import { TProject, EProjectStatus } from 'sharedTypes'
import { formatDateKeyLookup, projectStatusLookup } from 'utilities'
import database from 'database'

type EditProjectModalProps = {
    projectId: TProject['id']
    showModal: boolean
    setShowModal: (showModal: boolean) => void
}

const EditProjectModal = ({ showModal, setShowModal, projectId }: EditProjectModalProps) => {
    const [title, setTitle] = React.useState<string>('')
    const [status, setStatus] = React.useState<EProjectStatus>(EProjectStatus.ACTIVE)
    const [submitDisabled, setSubmitDisabled] = React.useState<boolean>(true)
    const [isLoading, setIsLoading] = React.useState<boolean>(true)

    React.useEffect(() => {
        database
            .projects.where('id').equals(projectId).first()
            .then((project: TProject) => {
                setTitle(project.title)
                setStatus(project.status)
                setIsLoading(false)
            })
    }, [])

    const handleSubmit = () => {
        const editedProject = {
            title,
            status,
            id: projectId
        }
        database.projects.put(editedProject, [projectId])
        setShowModal(false)
    }

    return (
        <Modal
            contentLabel="Edit Project"
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            {
                isLoading
                    ? <Paragraph>One sec</Paragraph>
                    : (
                        <Form onChange={() => setSubmitDisabled(false)}>
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
                                    <Button key="cancel" variation="INTERACTION" onClick={() => setShowModal(false)}>Cancel</Button>,
                                    <Button
                                        key="save"
                                        type="button"
                                        disabled={submitDisabled}
                                        variation="WARNING"
                                        onClick={handleSubmit}
                                    >
                                        Save
                                    </Button>
                                ]
                            }
                            />
                        </Form>
                    )
            }

        </Modal>
    )
}

export default EditProjectModal
