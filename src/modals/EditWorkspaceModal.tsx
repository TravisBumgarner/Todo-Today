import { Button, TextField, Typography } from '@mui/material'
import { useCallback, useContext, useEffect, useState } from 'react'

import { context } from 'Context'
import database from 'database'
import { ButtonWrapper } from 'sharedComponents'
import { type TWorkspace } from 'types'
import Modal from './Modal'

interface Props {
  workspaceId: string
}

const EditWorkspaceModal = ({ workspaceId }: Props) => {
  const { dispatch } = useContext(context)
  const [name, setName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const func = async () => {
      await database
        .workspaces.where('id').equals(workspaceId).first()
        .then((workspace: TWorkspace | undefined) => {
          if (!workspace) return
          setName(workspace.name)
          setIsLoading(false)
        })
    }
    void func()
  }, [workspaceId])

  const handleSubmit = useCallback(async () => {
    const editedWorkspace: TWorkspace = {
      id: workspaceId,
      name
    }
    await database.workspaces.put(editedWorkspace, [workspaceId])
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch, workspaceId, name])

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  return (
    <Modal
      title="Edit Workspace"
      showModal={true}
    >
      {
        isLoading
          ? <Typography variant="body1">One sec</Typography>
          : (
            <form>
              <TextField
                label="Name"
                name="name"
                value={name}
                margin="normal"
                fullWidth
                onChange={event => { setName(event.target.value) }}
              />
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

export default EditWorkspaceModal
