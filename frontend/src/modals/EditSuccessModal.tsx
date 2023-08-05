import React, { useCallback, useEffect, useContext, useState } from 'react'
import moment from 'moment'
import { Button, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'

import { Modal } from 'sharedComponents'
import { type TProject, type TSuccess } from 'sharedTypes'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { formatDateKeyLookup } from 'utilities'
import { context } from 'Context'

const AddSuccessModal = () => {
  const { state, dispatch } = useContext(context)
  const [description, setDescription] = useState<string>('')
  const [projectId, setProjectId] = useState<TProject['id'] | ''>('')
  const [date, setDate] = useState<TProject['id'] | ''>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const projects = useLiveQuery(async () => {
    return await database.projects.toArray()
  }, [])

  useEffect(() => {
    void database
      .successes.where('id').equals(state.activeModal?.data.successId).first()
      .then((s: TSuccess) => {
        setDate(s.date)
        setDescription(s.description)
        setProjectId(s.projectId)
        setIsLoading(false)
      })
  }, [state.activeModal?.data.successId])

  const handleSubmit = useCallback(async () => {
    const editetSuccess = {
      description,
      id: state.activeModal?.data.successId,
      projectId,
      date: formatDateKeyLookup(moment(date))
    }
    await database.successes.put(editetSuccess, [state.activeModal?.data.successId])
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch, description, projectId, state.activeModal?.data.successId, date])

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  const projectSelectOptions = projects ? projects.map(({ id, title }) => ({ value: id, label: title })) : []
  projectSelectOptions.unshift({ value: '', label: 'Select a Project' })

  return (
    <Modal
      title="Add Success"
      showModal={true}
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
                onClick={handleCancel}
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
