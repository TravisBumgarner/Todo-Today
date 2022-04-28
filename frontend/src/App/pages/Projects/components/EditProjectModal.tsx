import React from 'react'
import moment, { Moment } from 'moment'

import { Button, Modal, ButtonWrapper, LabelAndInput } from 'sharedComponents'
import { TProject, TProjectStatus } from 'sharedTypes'
import {context } from 'Context'
import { projectStatusLookup } from 'utilities'

type EditProjectModalProps = {
    selectedProjectId: TProject['id']
    showModal: boolean
    setShowModal: (showModal: boolean) => void
}

const EditProjectModal = ({ showModal, setShowModal, selectedProjectId }: EditProjectModalProps) => {
    const { dispatch, state } = React.useContext(context)

    const project = state.projects[selectedProjectId]

    const [title, setTitle] = React.useState<string>(project.title)
    const [startDate, setStartDate] = React.useState<Moment | null>(project.startDate ? moment(project.startDate) : null)
    const [endDate, setEndDate] = React.useState<Moment | null>(project.endDate ? moment(project.endDate) : null)
    const [status, setStatus] = React.useState<TProjectStatus>(project.status)
    const [submitDisabled, setSubmitDisabled] = React.useState<boolean>(true)

    const handleSubmit = () => {
        const editedProject = {
            title,
            startDate: startDate ? moment(startDate) : null,
            endDate: endDate ? moment(endDate) : null,
            status,
            id: project.id
        }
        
        dispatch({type: "EDIT_PROJECT", payload: editedProject})
        setShowModal(false)
    }

    return (
        <Modal
            contentLabel="Edit Project"
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            <form onChange={() => setSubmitDisabled(false)}>
                <LabelAndInput
                    label="Title"
                    name="title"
                    value={title}
                    handleChange={(data) => setTitle(data)}
                />
                <LabelAndInput
                    label="Start Date"
                    name="startDate"
                    value={startDate ? startDate.format('YYYY-MM-DD') : ''}
                    inputType="date"
                    handleChange={(date) => setStartDate(moment(date))}
                />
                <LabelAndInput
                    label="End Date"
                    name="endDate"
                    value={endDate ? endDate.format('YYYY-MM-DD') : ''}
                    inputType="date"
                    handleChange={(date) => setEndDate(moment(date))}
                />
                <LabelAndInput
                    label="Status"
                    name="status"
                    value={status}
                    options={TProjectStatus}
                    optionLabels={projectStatusLookup}
                    inputType="select-enum"
                    handleChange={(status: TProjectStatus) => setStatus(status)}
                />
                <ButtonWrapper right={
                    [
                        <Button key="cancel" variation="PRIMARY_BUTTON" onClick={() => setShowModal(false)}>Cancel</Button>,
                        <Button key="save" disabled={submitDisabled} variation="ALERT_BUTTON" onClick={handleSubmit}>Save</Button>
                    ]
                }
                />
            </form>
        </Modal >
    )
}

export default EditProjectModal