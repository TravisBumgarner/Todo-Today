import React from 'react'
import { v4 as uuid4 } from 'uuid'
import { Button, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material'

import { Modal } from 'sharedComponents'
import { type TProject, ETaskStatus, EProjectStatus, type TDateISODate } from 'sharedTypes'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'

interface AddTaskModalProps {
    showModal: boolean
    project?: TProject
    setShowModal: (showModal: boolean) => void
    selectedDate: TDateISODate
}

const AddTaskModal = ({ showModal, setShowModal, project, selectedDate }: AddTaskModalProps) => {
    const [title, setTitle] = React.useState<string>('')
    const [projectId, setProjectId] = React.useState<TProject['id'] | ''>(project ? project.id : '')
    const [addToSelectedDate, setAddToSelectedDate] = React.useState<'yes' | 'no'>('yes')

    const projects = useLiveQuery(async () => {
        return await database
            .projects
            .where('status')
            .anyOf(EProjectStatus.ACTIVE)
            .toArray()
    }, [])

    const handleSubmit = async () => {
        const taskId = uuid4()

        const newTask = {
            title,
            status: ETaskStatus.NEW,
            id: taskId,
            projectId
        }
        await database.tasks.add(newTask)

        if (addToSelectedDate === 'yes') {
            await database.todoListItems.add({
                projectId,
                taskId,
                id: taskId,
                todoListDate: selectedDate,
                details: ''
            })
        }
        setShowModal(false)
    }

    const projectSelectOptions = projects ? projects.map((p) => ({ value: p.id, label: p.title })) : []
    projectSelectOptions.unshift({ value: '', label: 'Select a Project' })

    return (
        <Modal
            contentLabel="Add New Task"
            showModal={showModal}
            closeModal={() => { setShowModal(false) }}
        >
            <form>
                <TextField
                    label="Task"
                    name="title"
                    value={title}
                    onChange={(event) => { setTitle(event.target.value) }}
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
                {/* TODO - needs data */}
                <FormControlLabel control={<Switch defaultChecked />} label="Add to today?" />

                <Button
                    key="cancel"

                    onClick={() => { setShowModal(false) }}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    disabled={title.length === 0 || projectId.length === 0}
                    key="save"

                    onClick={handleSubmit}
                >
                    Save
                </Button>
            </form>
        </Modal>
    )
}

export default AddTaskModal
