import React from 'react'
import moment, { Moment } from 'moment'

import { Button, Modal, ButtonWrapper, LabelAndInput } from 'sharedComponents'
import { TProject, TProjectStatus } from 'sharedTypes'

type EditProjectModalProps = {
    project: TProject
    showModal: boolean
    setShowModal: (showModal: boolean) => void
    setProjects: React.Dispatch<React.SetStateAction<Record<string, TProject>>>
}

const EditProjectModal = ({ showModal, setShowModal, setProjects, project }: EditProjectModalProps) => {
    const [title, setTitle] = React.useState<string>(project.title)
    const [startDate, setStartDate] = React.useState<Moment | null>(project.startDate ? moment(project.startDate) : null)
    const [endDate, setEndDate] = React.useState<Moment | null>(project.endDate ? moment(project.endDate) : null)
    const [stats, setStatus] = React.useState<TProjectStatus>(project.status)
    const [submitDisabled, setSubmitDisabled] = React.useState<boolean>(true)

    const handleSubmit = () => {
        console.log('before submit', startDate, endDate)
        const editedProject = {
            title,
            startDate: startDate ? moment(startDate) : null,
            endDate: endDate ? moment(endDate) : null,
            status: TProjectStatus.NEW,
            id: project.id
        }
        
        console.log(editedProject)

        setProjects(prev => ({...prev, [project.id]: {...editedProject}}))
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
                    inputType="select"
                    handleChange={(status: TProjectStatus) => setStatus(status)}
                />
                <ButtonWrapper right={
                    [
                        <Button key="cancel" variation="FOREGROUND_PRIMARY" onClick={() => setShowModal(false)}>Cancel</Button>,
                        <Button key="save" disabled={submitDisabled} variation="FOREGROUND_ALERT" onClick={handleSubmit}>Save</Button>
                    ]
                }
                />
            </form>
        </Modal >
    )
}

export default EditProjectModal