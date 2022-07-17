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
    const [startDate, setStartDate] = React.useState<Moment | null>(null)
    const [endDate, setEndDate] = React.useState<Moment | null>(null)

    const handleSubmit = async () => {
        const newProject: TProject = {
            id: uuid4(),
            title,
            startDate: endDate ? formatDateKeyLookup(moment(startDate)) : null,
            endDate: endDate ? formatDateKeyLookup(moment(endDate)) : null,
            status,
        }
        await database.projects.add(newProject)
        setShowModal(false)
    }

    React.useEffect(() => {
        if (status === EProjectStatus.REOCURRING) {
            setStartDate(null)
            setEndDate(null)
        }
    }, [status])

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
                    label="Status"
                    name="status"
                    value={status}
                    options={EProjectStatus}
                    optionLabels={projectStatusLookup}
                    inputType="select-enum"
                    handleChange={(newStatus: EProjectStatus) => setStatus(newStatus)}
                />
                <LabelAndInput
                    label="Start Date (Optional)"
                    disabled={status === EProjectStatus.REOCURRING}
                    name="startDate"
                    value={startDate ? startDate.format('YYYY-MM-DD') : ''}
                    inputType="date"
                    handleChange={(date) => setStartDate(moment(date))}
                />
                <LabelAndInput
                    label="End Date (Optional)"
                    name="endDate"
                    disabled={status === EProjectStatus.REOCURRING}
                    value={endDate ? endDate.format('YYYY-MM-DD') : ''}
                    inputType="date"
                    handleChange={(date) => setEndDate(moment(date))}
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
