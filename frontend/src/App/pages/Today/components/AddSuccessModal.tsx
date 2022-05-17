import React from 'react'
import { v4 as uuid4 } from 'uuid'
import moment from 'moment'

import { Button, Modal, ButtonWrapper, LabelAndInput, Form } from 'sharedComponents'
import { TDateISODate, TProject } from 'sharedTypes'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { formatDateKeyLookup } from 'utilities'

type AddSuccessModalProps = {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
    selectedDate: TDateISODate
}

const AddSuccessModal = ({ showModal, setShowModal, selectedDate }: AddSuccessModalProps) => {
    const [description, setDescription] = React.useState<string>('')
    const [projectId, setProjectId] = React.useState<TProject['id'] | ''>('')
    const [date, setDate] = React.useState<TProject['id'] | ''>(selectedDate)

    const projects = useLiveQuery(async () => {
        return await database.projects.toArray()
    }, [])

    const handleSubmit = () => {
        console.log('hi')
        const newSuccess = {
            description,
            id: uuid4(),
            projectId,
            date: formatDateKeyLookup(moment(date))
        }
        database.successes.add(newSuccess)
        setShowModal(false)
    }

    const projectSelectOptions = projects ? projects.map(({ id, title }) => ({ value: id, label: title })) : []
    projectSelectOptions.unshift({ value: '', label: 'Select a Project' })

    return (
        <Modal
            contentLabel={`Add Success`}
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            <Form>
                <LabelAndInput
                    label="Description"
                    name="description"
                    value={description}
                    handleChange={(description) => setDescription(description)}
                />
                <LabelAndInput
                    name="project"
                    value={projectId}
                    options={projectSelectOptions}
                    inputType="select-array"
                    label="Project (Optional)"
                    handleChange={(value) => setProjectId(value)}
                />
                <LabelAndInput
                    label="Date"
                    name="date"
                    value={moment(date).format('YYYY-MM-DD')}
                    inputType="date"
                    handleChange={(date) => setDate(date)}
                />
                <ButtonWrapper right={
                    [
                        <Button key="cancel" variation="WARNING" onClick={() => setShowModal(false)}>Cancel</Button>,
                        <Button disabled={description.length === 0} key="save" variation="INTERACTION" onClick={handleSubmit}>Save</Button>
                    ]
                }
                />
            </Form>
        </Modal>
    )
}

export default AddSuccessModal
