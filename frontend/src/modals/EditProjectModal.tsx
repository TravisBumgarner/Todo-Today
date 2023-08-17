import React, { useCallback, useEffect, useState, useContext } from 'react'
import { Button, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'

import Modal from './Modal'
import { type TProject, EProjectStatus } from 'sharedTypes'
import { projectStatusLookup } from 'utilities'
import database from 'database'
import { context } from 'Context'

const EditProjectModal = () => {
  const { state, dispatch } = useContext(context)
  const [title, setTitle] = useState<string>('')
  const [status, setStatus] = useState<EProjectStatus>(EProjectStatus.ACTIVE)
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const func = async () => {
      await database
        .projects.where('id').equals(state.activeModal?.data.projectId).first()
        .then((project: TProject) => {
          setTitle(project.title)
          setStatus(project.status)
          setIsLoading(false)
        })
    }
    void func()
  }, [state.activeModal?.data.projectId])

  const handleSubmit = useCallback(async () => {
    const editedProject = {
      title,
      status,
      id: state.activeModal?.data.projectId
    }
    await database.projects.put(editedProject, [state.activeModal?.data.projectId])
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch, state.activeModal?.data.projectId, status, title])

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  return (
    <Modal
      title="Edit Project"
      showModal={true}
    >
      {
        isLoading
          ? <Typography variant="body1">One sec</Typography>
          : (
            <form onChange={() => { setSubmitDisabled(false) }}>
              <TextField
                label="Title"
                name="title"
                value={title}
                fullWidth
                onChange={event => { setTitle(event.target.value) }}
              />
              <InputLabel id="project-status">Project Status</InputLabel>
              <Select
                labelId="project-status"
                fullWidth
                value={state.activeModal?.data.projectId}
                label="Project Status"
                onChange={(event) => { setStatus(event.target.value as EProjectStatus) }}
              >
                {Object.keys(EProjectStatus).map((key) => <MenuItem key={key} value={key}>{projectStatusLookup[key as EProjectStatus]}</MenuItem>)}
              </Select>
              <Button fullWidth key="cancel" onClick={handleCancel}>Cancel</Button>
              <Button
                key="save"
                type="button"
                disabled={submitDisabled}
                fullWidth
                onClick={handleSubmit}
                variant='contained'
              >
                Save
              </Button>
            </form>
          )
      }

    </Modal>
  )
}

export default EditProjectModal
