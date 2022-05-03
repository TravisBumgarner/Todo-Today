import React from 'react'
import moment, { Moment } from 'moment'
import { v4 as uuid4 } from 'uuid'

import { context } from 'Context'
import { Button, Modal, ButtonWrapper, LabelAndInput } from 'sharedComponents'
import { TProject, TProjectStatus } from 'sharedTypes'
import { formatDateKeyLookup } from 'utilities'


type AddProjectModalProps = {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
}

const AddProjectModal = ({ showModal, setShowModal }: AddProjectModalProps) => {
    const { dispatch } = React.useContext(context)

    const [title, setTitle] = React.useState<string>('')
    const [startDate, setStartDate] = React.useState<Moment>(moment())
    const [endDate, setEndDate] = React.useState<Moment>(moment())

    const handleSubmit = () => {
        const newProject: TProject = {
            title,
            startDate: formatDateKeyLookup(moment(startDate)),
            endDate: formatDateKeyLookup(moment(endDate)),
            status: TProjectStatus.NEW,
            id: uuid4()
        } 

        dispatch({type: "ADD_PROJECT", payload: newProject})
        setShowModal(false)
    }

    return (
        <Modal
            contentLabel="Add Project"
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            <>
                <LabelAndInput
                    label="Title"
                    name="title"
                    value={title}
                    handleChange={(data) => setTitle(data)}
                />
                <LabelAndInput
                    label="Start Date"
                    name="startDate"
                    value={startDate.format('YYYY-MM-DD')}
                    inputType="date"
                    handleChange={(date) => setStartDate(moment(date))}
                />
                <LabelAndInput
                    label="End Date"
                    name="endDate"
                    value={endDate.format('YYYY-MM-DD')}
                    inputType="date"
                    handleChange={(date) => setEndDate(moment(date))}
                />
                <ButtonWrapper right={
                    [
                        <Button key="cancel" variation="ALERT_BUTTON" onClick={() => setShowModal(false)}>Cancel</Button>,
                        <Button key="save" variation="PRIMARY_BUTTON" onClick={handleSubmit}>Save</Button>
                    ]
                }
                />
            </>
        </Modal >
    )
}

export default AddProjectModal