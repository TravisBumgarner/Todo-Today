import React, { useCallback, useState, useContext } from 'react'
import { v4 as uuid4 } from 'uuid'
import { Button, InputLabel, MenuItem, Select, TextField } from '@mui/material'

import Modal from './Modal'
import { type TProject } from 'sharedTypes'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { context } from 'Context'

const AddSuccessModal = () => {
  const { state, dispatch } = useContext(context)
  const [description, setDescription] = useState<string>('')
  const [projectId, setProjectId] = useState<TProject['id'] | ''>('')

  const projects = useLiveQuery(async () => {
    return await database.projects.toArray()
  }, [])

  const handleSubmit = useCallback(async () => {
    const newSuccess = {
      description,
      id: uuid4(),
      projectId,
      date: state.selectedDate
    }
    await database.successes.add(newSuccess)
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch, description, projectId, state.selectedDate])

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  const projectSelectOptions = projects ? projects.map((p) => ({ value: p.id, label: p.title })) : []

  return (
    <Modal
      title="Add Success"
      showModal={true}
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
        <Button fullWidth key="cancel" onClick={handleCancel}>Cancel</Button>
        <Button fullWidth variant='contained' disabled={description.length === 0} key="save" onClick={handleSubmit}>Save</Button>
      </form>
    </Modal>
  )
}

export default AddSuccessModal
