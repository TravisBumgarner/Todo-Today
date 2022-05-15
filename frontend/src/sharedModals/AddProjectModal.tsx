import React from 'react'
import moment, { Moment } from 'moment'
import { v4 as uuid4 } from 'uuid'

import database from 'database'
import { Button, Modal, ButtonWrapper, LabelAndInput, Form, Paragraph } from 'sharedComponents'
import { TProject, EProjectStatus } from 'sharedTypes'
import { formatDateKeyLookup } from 'utilities'

type AddProjectModalProps = {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
}

const AddProjectModal = ({ showModal, setShowModal }: AddProjectModalProps) => {
    const [title, setTitle] = React.useState<string>('')
    const [startDate, setStartDate] = React.useState<Moment | null>(null)
    const [endDate, setEndDate] = React.useState<Moment | null>(null)

    const handleSubmit = async () => {
        const newProject: TProject = {
            id: uuid4(),
            title,
            startDate: endDate ? formatDateKeyLookup(moment(startDate)) : null,
            endDate: endDate ? formatDateKeyLookup(moment(endDate)) : null,
            status: EProjectStatus.NEW,
        }
        await database.projects.add(newProject)
        setShowModal(false)
    }

    return (
        <Modal
            contentLabel="Add Project"
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
                <ButtonWrapper right={
                    [
                        <Button key="cancel" variation="WARNING" onClick={() => setShowModal(false)}>Cancel</Button>,
                        <Button key="save" disabled={title.length === 0} variation="INTERACTION" onClick={handleSubmit}>Save</Button>
                    ]
                }
                />
            </Form>
        </Modal>
    )
}

export default AddProjectModal
