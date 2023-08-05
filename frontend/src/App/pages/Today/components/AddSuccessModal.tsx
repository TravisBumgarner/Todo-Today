import React from 'react'
import { v4 as uuid4 } from 'uuid'
import { Button, InputLabel, MenuItem, Select, TextField } from '@mui/material'

import { Modal } from 'sharedComponents'
import { EProjectStatus, type TDateISODate, type TProject } from 'sharedTypes'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { projectStatusLookup } from 'utilities'

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

    return (
        <Modal
            contentLabel="Add Success"
            showModal={showModal}
            closeModal={() => { setShowModal(false) }}
        >
            <form>
                <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={description}
                    onChange={(event) => { setDescription(event.target.value) }}
                />
                <InputLabel id="project-id">Project</InputLabel>
                <Select
                    fullWidth
                    labelId="project-id"
                    value={projectId}
                    label="Project"
                    onChange={(event) => { setProjectId(event.target.value) }}
                >
                    {(projectSelectOptions.map(({ label, value }) => <MenuItem key={value} value={value}>{label}</MenuItem>))}
                </Select>
                <Button fullWidth key="cancel" onClick={() => { setShowModal(false) }}>Cancel</Button>
                <Button fullWidth variant='contained' disabled={description.length === 0} key="save" onClick={handleSubmit}>Save</Button>
            </form>
        </Modal>
    )
}

export default AddSuccessModal
