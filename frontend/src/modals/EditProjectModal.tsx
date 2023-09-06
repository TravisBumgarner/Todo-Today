import React, { useCallback, useEffect, useState, useContext } from 'react'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'

import Modal from './Modal'
import { type TProject, EProjectStatus } from 'sharedTypes'
import { projectStatusLookup } from 'utilities'
import database from 'database'
import { context } from 'Context'

interface Props {
  projectId: string
}

const EditProjectModal = ({ projectId }: Props) => {
  const { dispatch } = useContext(context)
  const [title, setTitle] = useState<string>('')
  const [status, setStatus] = useState<EProjectStatus>(EProjectStatus.ACTIVE)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const func = async () => {
      await database
        .projects.where('id').equals(projectId).first()
        .then((project: TProject) => {
          setTitle(project.title)
          setStatus(project.status)
          setIsLoading(false)
        })
    }
    void func()
  }, [projectId])

  const handleSubmit = useCallback(async () => {
    const editedProject = {
      title,
      status,
      id: projectId
    }
    await database.projects.put(editedProject, [projectId])
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch, projectId, status, title])

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
            <form>
              <TextField
                label="Title"
                name="title"
                value={title}
                margin="normal"
                fullWidth
                onChange={event => { setTitle(event.target.value) }}
              />
              <FormControl fullWidth margin='normal'>
                <InputLabel id="project-status">Project Status</InputLabel>
                <Select
                  labelId="project-status"
                  fullWidth
                  value={status}
                  label="Project Status"
                  onChange={(event) => { setStatus(event.target.value as EProjectStatus) }}
                >
                  {Object.keys(EProjectStatus).map((key) => <MenuItem key={key} value={key}>{projectStatusLookup[key as EProjectStatus]}</MenuItem>)}
                </Select>
              </FormControl>
              <Button fullWidth key="cancel" onClick={handleCancel}>Cancel</Button>
              <Button
                key="save"
                type="button"
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
