import React from 'react'
import moment from 'moment'
import { Button, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'

import { Modal } from 'sharedComponents'
import { type TProject, type TSuccess } from 'sharedTypes'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { formatDateKeyLookup } from 'utilities'

interface AddSuccessModalProps {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
    successId: TSuccess['id']
}

const AddSuccessModal = ({ showModal, setShowModal, successId }: AddSuccessModalProps) => {
    const [description, setDescription] = React.useState<string>('')
    const [projectId, setProjectId] = React.useState<TProject['id'] | ''>('')
    const [date, setDate] = React.useState<TProject['id'] | ''>('')
    const [isLoading, setIsLoading] = React.useState<boolean>(true)

    const projects = useLiveQuery(async () => {
        return await database.projects.toArray()
    }, [])

    React.useEffect(() => {
        void database
            .successes.where('id').equals(successId).first()
            .then((s: TSuccess) => {
                setDate(s.date)
                setDescription(s.description)
                setProjectId(s.projectId)
                setIsLoading(false)
            })
    }, [successId])

    const handleSubmit = async () => {
        const editetSuccess = {
            description,
            id: successId,
            projectId,
            date: formatDateKeyLookup(moment(date))
        }
        await database.successes.put(editetSuccess, [successId])
        setShowModal(false)
    }

    const projectSelectOptions = projects ? projects.map(({ id, title }) => ({ value: id, label: title })) : []
    projectSelectOptions.unshift({ value: '', label: 'Select a Project' })

    return (
        <Modal
            contentLabel="Add Success"
            showModal={showModal}
            closeModal={() => { setShowModal(false) }}
        >
            {
                isLoading
                    ? <Typography variant="body1">One sec</Typography>
                    : (
                        <form>
                            <TextField
                                label="Description"
                                name="description"
                                value={description}
                                onChange={(event) => { setDescription(event.target.value) }}
                            />
                            <InputLabel id="project-select">Project</InputLabel>
                            <Select
                                labelId="project-select"
                                value={projectId}
                                label="Project"
                                onChange={(event) => { setProjectId(event.target.value) }}
                            >
                                {projectSelectOptions.map(({ label, value }) => <MenuItem key={label} value={value}>{label}</MenuItem>)}
                            </Select>
                            <TextField
                                label="Date"
                                name="date"
                                value={moment(date).format('YYYY-MM-DD')}
                                type="date"
                                onChange={(event) => { setDate(event.target.value) }}
                            />
                            <Button
                                key="cancel"

                                onClick={() => { setShowModal(false) }}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={description.length === 0}
                                key="save"

                                onClick={handleSubmit}
                            >
                                Save
                            </Button>
                        </form>
                    )
            }
        </Modal>
    )
}

export default AddSuccessModal
