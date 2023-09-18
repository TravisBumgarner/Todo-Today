import React, { useCallback, useEffect, useState, useContext } from 'react'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'

import Modal from './Modal'
import { type TTask, ETaskStatus } from 'sharedTypes'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { taskStatusLookup } from 'utilities'
import { context } from 'Context'
import { ButtonWrapper } from 'sharedComponents'

interface Props {
  taskId: string
}

const EditTaskModal = ({ taskId }: Props) => {
  const { dispatch } = useContext(context)
  const [title, setTitle] = useState<string>('')
  const [status, setStatus] = useState<ETaskStatus>(ETaskStatus.NEW)
  const [projectId, setProjectId] = useState<string>('')
  const projects = useLiveQuery(async () => await database.projects.toArray(), [])

  useEffect(() => {
    void database
      .tasks.where('id').equals(taskId).first()
      .then((t: TTask) => {
        setTitle(t.title)
        setProjectId(t.projectId)
        setStatus(t.status)
      })
  }, [taskId])

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  const handleSubmit = useCallback(async () => {
    await database.tasks.where('id').equals(taskId).modify({ title, status, projectId })

    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch, taskId, projectId, status, title])

  const projectSelectOptions = projects ? projects.map(({ id, title }) => ({ value: id, label: title })) : []

  return (
    <Modal
      title="Edit Task"
      showModal={true}
    >
      <form>
        <TextField
          fullWidth
          label="Task"
          name="title"
          margin='normal'
          value={title}
          onChange={(event) => { setTitle(event.target.value) }}
        />
        <FormControl fullWidth margin='normal'>
          <InputLabel id="edit-task-modal-status">Status</InputLabel>
          <Select
            label="Status"
            labelId="edit-task-modal-status"
            fullWidth
            value={status}
            onChange={(event) => { setStatus(event.target.value as ETaskStatus) }}
          >
            {Object.keys(ETaskStatus).map(key => <MenuItem key={key} value={key}>{taskStatusLookup[key as ETaskStatus]}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl fullWidth margin='normal'>
          <InputLabel id="edit-task-modal-project-select">Project</InputLabel>
          <Select
            label="Project"
            labelId="edit-task-modal-project-select"
            fullWidth
            value={projectId}
            onChange={(event) => { setProjectId(event.target.value) }}
          >
            {projectSelectOptions.map(({ label, value }) => <MenuItem key={label} value={value}>{label}</MenuItem>)}
          </Select>
        </FormControl>
        <ButtonWrapper>
          <Button variant='contained'
            color="secondary" fullWidth key="cancel" onClick={handleCancel}>Cancel</Button>
          <Button
            fullWidth
            type="button"
            key="save"
            variant='contained'
            onClick={handleSubmit}
          >
            Save
          </Button>
        </ButtonWrapper>
      </form>
    </Modal>
  )
}

export default EditTaskModal
