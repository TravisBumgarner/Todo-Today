import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useCallback, useContext, useEffect, useState } from 'react'

import { context } from 'Context'
import database from 'database'
import { ButtonWrapper } from 'sharedComponents'
import { EProjectStatus, type TProject } from 'types'
import { projectStatusLookup } from 'utilities'
import Modal from './Modal'

interface Props {
  projectId: string
}

const EditProjectModal = ({ projectId }: Props) => {
  const { dispatch, state: { activeWorkspaceId } } = useContext(context)
  const [title, setTitle] = useState<string>('')
  const [status, setStatus] = useState<EProjectStatus>(EProjectStatus.ACTIVE)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const func = async () => {
      await database
        .projects.where('id').equals(projectId).first()
        .then((project: TProject | undefined) => {
          if (!project) return
          setTitle(project.title)
          setStatus(project.status)
          setIsLoading(false)
        })
    }
    void func()
  }, [projectId])

  const handleSubmit = useCallback(async () => {
    const editedProject: TProject = {
      workspaceId: activeWorkspaceId,
      title,
      status,
      id: projectId
    }
    await database.projects.put(editedProject, [projectId])
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch, projectId, status, title, activeWorkspaceId])

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
              <ButtonWrapper>
                <Button variant='contained'
                  color="secondary" fullWidth key="cancel" onClick={handleCancel}>Cancel</Button>
                <Button
                  key="save"
                  type="button"
                  fullWidth
                  onClick={handleSubmit}
                  variant='contained'
                >
                  Save
                </Button>
              </ButtonWrapper>
            </form>
          )
      }

    </Modal>
  )
}

export default EditProjectModal
