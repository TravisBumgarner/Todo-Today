import { useCallback, useEffect, useState, useContext } from 'react'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'

import Modal from './Modal'
import { type TTask, ETaskStatus } from 'types'
import database from 'database'
import { sortStrings } from 'utilities'
import { context } from 'Context'
import { ButtonWrapper, TaskStatusSelector } from 'sharedComponents'

interface Props {
  taskId: string
}

const EditTaskModal = ({ taskId }: Props) => {
  const { dispatch } = useContext(context)
  const [title, setTitle] = useState<string>('')
  const [details, setDetails] = useState<string>('')
  const [status, setStatus] = useState<ETaskStatus>(ETaskStatus.NEW)
  const [projectId, setProjectId] = useState<string>('')
  const projects = useLiveQuery(async () => await database.projects.toArray(), [])

  useEffect(() => {
    void database
      .tasks.where('id').equals(taskId).first()
      .then((t: TTask | undefined) => {
        if (!t) return

        setTitle(t.title)
        setProjectId(t.projectId)
        setStatus(t.status)
        setDetails(t.details ?? '')
      })
  }, [taskId])

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  const handleSubmit = useCallback(async () => {
    await database.tasks.where('id').equals(taskId).modify({ title, status, projectId, details })

    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch, taskId, projectId, status, title, details])

  const projectSelectOptions = projects ? projects.sort((a, b) => sortStrings(a.title, b.title)).map(({ id, title }) => ({ value: id, label: title })) : []

  return (
    <Modal
      title="Edit Task"
      showModal={true}
    >
      <form>
        <TextField
          autoFocus
          fullWidth
          label="Task"
          name="title"
          margin='normal'
          value={title}
          onChange={(event) => { setTitle(event.target.value) }}
        />
        <FormControl fullWidth margin='normal'>
          <InputLabel id="edit-task-modal-project-select">Project</InputLabel>
          <Select
            label="Project"
            labelId="edit-task-modal-project-select"
            fullWidth
            value={projectId}
            onChange={(event) => { setProjectId(event.target.value) }}
          >
            {projectSelectOptions.map(({ label, value }) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField
          multiline
          fullWidth
          label="Details"
          name="details"
          value={details}
          margin='normal'
          onChange={(event) => { setDetails(event.target.value) }}
        />
        <TaskStatusSelector taskStatus={status} handleStatusChangeCallback={setStatus} showLabel />
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
