import React from 'react'
import moment, { Moment } from 'moment'

import { Button, Modal, ButtonWrapper, LabelAndInput, Form } from 'sharedComponents'
import { TProject, EProjectStatus } from 'sharedTypes'
import { formatDateKeyLookup, projectStatusLookup } from 'utilities'
import database from 'database'

type EditProjectModalProps = {
    project: TProject
    showModal: boolean
    setShowModal: (showModal: boolean) => void
}

const EditProjectModal = ({ showModal, setShowModal, project }: EditProjectModalProps) => {
    const [title, setTitle] = React.useState<string>(project.title)
    const [startDate, setStartDate] = React.useState<Moment | null>(project.startDate ? moment(project.startDate) : null)
    const [endDate, setEndDate] = React.useState<Moment | null>(project.endDate ? moment(project.endDate) : null)
    const [status, setStatus] = React.useState<EProjectStatus>(project.status)
    const [submitDisabled, setSubmitDisabled] = React.useState<boolean>(true)

    const handleSubmit = () => {
        const editedProject = {
            title,
            startDate: startDate ? formatDateKeyLookup(startDate) : null,
            endDate: endDate ? formatDateKeyLookup(endDate) : null,
            status,
            id: project.id
        }
        database.projects.put(editedProject, [project.id])
        setShowModal(false)
    }

    return (
        <Modal
            contentLabel="Edit Project"
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            <Form onChange={() => setSubmitDisabled(false)}>
                <LabelAndInput
                    label="Title"
                    name="title"
                    value={title}
                    handleChange={(data) => setTitle(data)}
                />
                <LabelAndInput
                    label="Start Date (Optional)"
                    name="startDate"
                    value={startDate ? startDate.format('YYYY-MM-DD') : ''}
                    inputType="date"
                    handleChange={(date) => setStartDate(moment(date))}
                />
                <LabelAndInput
                    label="End Date (Optional)"
                    name="endDate"
                    value={endDate ? endDate.format('YYYY-MM-DD') : ''}
                    inputType="date"
                    handleChange={(date) => setEndDate(moment(date))}
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
                        <Button key="save" disabled={submitDisabled} variation="WARNING" onClick={handleSubmit}>Save</Button>
                    ]
                }
                />
            </Form>
        </Modal>
    )
}

export default EditProjectModal
