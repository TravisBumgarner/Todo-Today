import React, { useCallback, useState, useContext } from 'react'
import { v4 as uuid4 } from 'uuid'
import { Button, FormControlLabel, MenuItem, OutlinedInput, Select, Switch, TextField } from '@mui/material'

import Modal from './Modal'
import { type TProject, ETaskStatus, EProjectStatus } from 'sharedTypes'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { context } from 'Context'

interface AddTaskModalProps {
  project?: TProject
}

const AddTaskModal = ({ project }: AddTaskModalProps) => {
  const { state, dispatch } = useContext(context)
  const [title, setTitle] = useState<string>('')
  const [projectId, setProjectId] = useState<TProject['id'] | ''>(project ? project.id : '')
  const [addToSelectedDate, setAddToSelectedDate] = useState<boolean>(true)

  const toggleAddToDate = useCallback(() => { setAddToSelectedDate(prev => !prev) }, [])

  const projects = useLiveQuery(async () => {
    return await database
      .projects
      .where('status')
      .anyOf(EProjectStatus.ACTIVE)
      .toArray()
  }, [])

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  const handleSubmit = async () => {
    const taskId = uuid4()

    const newTask = {
      title,
      status: ETaskStatus.NEW,
      id: taskId,
      projectId
    }
    await database.tasks.add(newTask)

    if (addToSelectedDate) {
      await database.todoListItems.add({
        projectId,
        taskId,
        id: taskId,
        todoListDate: state.selectedDate,
        details: ''
      })
    }
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }

  const projectSelectOptions = projects ? projects.map((p) => ({ value: p.id, label: p.title })) : []
  projectSelectOptions.unshift({ value: '', label: 'Select a Project' })

  return (
    <Modal
      title="Add New Task"
      showModal={true}
    >
      <form>
        <TextField
          fullWidth
          label="Task"
          name="title"
          value={title}
          margin='normal'
          onChange={(event) => { setTitle(event.target.value) }}
        />
        <Select
          input={<OutlinedInput label="ASDASDASDAD" />}
          label="Project"
          fullWidth
          labelId="project-select"
          value={projectId}
          onChange={(event) => { setProjectId(event.target.value) }}
        >
          {projectSelectOptions.map(({ label, value }) => <MenuItem key={label} value={value}>{label}</MenuItem>)}
        </Select>
        {/* TODO - needs data */}
        <FormControlLabel control={<Switch checked={addToSelectedDate} onChange={toggleAddToDate} />} label="Add to today?" />

        <Button
          key="cancel"
          fullWidth
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          type="button"
          variant='contained'
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
