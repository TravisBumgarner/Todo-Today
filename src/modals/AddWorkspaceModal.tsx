import { Button, TextField } from '@mui/material'
import { useCallback, useContext, useState } from 'react'
import { v4 as uuid4 } from 'uuid'

import { context } from 'Context'
import database from 'database'
import { ButtonWrapper } from 'sharedComponents'
import Modal from './Modal'

const AddWorkspaceModal = () => {
  const { dispatch } = useContext(context)
  const [name, setName] = useState<string>('')

  const handleSubmit = useCallback(async () => {
    const newWorkspace = {
      name,
      id: uuid4()
    }
    await database.workspaces.add(newWorkspace)
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
    dispatch({ type: 'CHANGE_WORKSPACE', payload: { workspaceId: newWorkspace.id } })
  }, [dispatch, name])

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  return (
    <Modal
      title="Add Workspace"
      showModal={true}
    >
      <form>
        <TextField
          autoFocus
          multiline
          margin='normal'
          fullWidth
          label="Name"
          name="name"
          value={name}
          onChange={(event) => { setName(event.target.value) }}
        />
        <ButtonWrapper>
          <Button color="secondary" variant='contained' fullWidth key="cancel" onClick={handleCancel}>Cancel</Button>
          <Button variant='contained' fullWidth disabled={name.length === 0} key="save" onClick={handleSubmit}>Save</Button>
        </ButtonWrapper>
      </form>
    </Modal>
  )
}

export default AddWorkspaceModal
