import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useContext, useState } from 'react'
import { v4 as uuid4 } from 'uuid'

import { context } from 'Context'
import database from 'database'
import { ButtonWrapper } from 'sharedComponents'
import { type TProject, type TSuccess } from 'types'
import { sortStrings } from 'utilities'
import Modal from './Modal'

const AddSuccessModal = () => {
  const { state: { selectedDate, settings: { activeWorkspaceId } }, dispatch } = useContext(context)
  const [description, setDescription] = useState<string>('')
  const [projectId, setProjectId] = useState<TProject['id'] | ''>('')

  const projects = useLiveQuery(async () => {
    return await database.projects.toArray()
  }, [])

  const handleSubmit = useCallback(async () => {
    const newSuccess: TSuccess = {
      description,
      id: uuid4(),
      projectId,
      workspaceId: activeWorkspaceId,
      date: selectedDate
    }
    await database.successes.add(newSuccess)
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch, description, projectId, selectedDate, activeWorkspaceId])

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  const projectSelectOptions = projects ? projects.sort((a, b) => sortStrings(a.title, b.title)).map((p) => ({ value: p.id, label: p.title })) : []

  return (
    <Modal
      title="Add Success"
      showModal={true}
    >
      <form>
        <TextField
          autoFocus
          multiline
          margin='normal'
          fullWidth
          label="Description"
          name="description"
          value={description}
          onChange={(event) => { setDescription(event.target.value) }}
        />
        <FormControl fullWidth margin='normal'>
          <InputLabel id="add-success-modal-project-select">Project</InputLabel>
          <Select
            label="Project"
            labelId="add-success-modal-project-select"
            fullWidth
            value={projectId}
            onChange={(event) => { setProjectId(event.target.value) }}
          >
            {projectSelectOptions.map(({ label, value }) => <MenuItem key={label} value={value}>{label}</MenuItem>)}
          </Select>
        </FormControl>
        <ButtonWrapper>
          <Button color="secondary" variant='contained' fullWidth key="cancel" onClick={handleCancel}>Cancel</Button>
          <Button variant='contained' fullWidth disabled={description.length === 0} key="save" onClick={handleSubmit}>Save</Button>
        </ButtonWrapper>
      </form>
    </Modal>
  )
}

export default AddSuccessModal
