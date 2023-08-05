import React from 'react'
import { v4 as uuid4 } from 'uuid'
import { Button } from '@mui/material'

import { Modal, LabelAndInput, Form } from 'sharedComponents'
import { type TDateISODate, type TProject } from 'sharedTypes'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'

interface AddSuccessModalProps {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
    selectedDate: TDateISODate
}

const AddSuccessModal = ({ showModal, setShowModal, selectedDate }: AddSuccessModalProps) => {
    const [description, setDescription] = React.useState<string>('')
    const [projectId, setProjectId] = React.useState<TProject['id'] | ''>('')

    const projects = useLiveQuery(async () => {
        return await database.projects.toArray()
    }, [])

    const handleSubmit = async () => {
        const newSuccess = {
            description,
            id: uuid4(),
            projectId,
            date: selectedDate
        }
        await database.successes.add(newSuccess)
        setShowModal(false)
    }

    const projectSelectOptions = projects ? projects.map((p) => ({ value: p.id, label: p.title })) : []
    projectSelectOptions.unshift({ value: '', label: 'Select a Project' })

    return (
        <Modal
            contentLabel="Add Success"
            showModal={showModal}
            closeModal={() => { setShowModal(false) }}
        >
            <Form>
                <LabelAndInput
                    label="Description"
                    name="description"
                    value={description}
                    handleChange={(value) => { setDescription(value) }}
                />
                <LabelAndInput
                    name="project"
                    value={projectId}
                    options={projectSelectOptions}
                    inputType="select-array"
                    label="Project (Optional)"
                    handleChange={(value) => { setProjectId(value) }}
                />
                <Button key="cancel" onClick={() => { setShowModal(false) }}>Cancel</Button>
                <Button disabled={description.length === 0} key="save" onClick={handleSubmit}>Save</Button>
            </Form>
        </Modal>
    )
}

export default AddSuccessModal
