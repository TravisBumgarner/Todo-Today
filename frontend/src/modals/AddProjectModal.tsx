import React, { useCallback } from 'react'
import { v4 as uuid4 } from 'uuid'
import { Button, TextField } from '@mui/material'

import database from 'database'
import { Modal } from 'sharedComponents'
import { type TProject, EProjectStatus } from 'sharedTypes'
import { context } from 'Context'

const AddProjectModal = () => {
  const [title, setTitle] = React.useState<string>('')
  const { dispatch } = React.useContext(context)

  const handleSubmit = useCallback(async () => {
    const newProject: TProject = {
      id: uuid4(),
      title,
      status: EProjectStatus.ACTIVE
    }
    await database.projects.add(newProject)
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch, title])

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  return (
    <Modal
      title="Add New Project"
      showModal={true}
    >
      <form>
        <TextField
          label="Title"
          name="title"
          value={title}
          onChange={(event) => { setTitle(event.target.value) }}
          fullWidth
        />
        <Button fullWidth key="cancel" onClick={handleCancel}>Cancel</Button>
        <Button
          fullWidth
          variant='contained'
          key="save"
          type="button"
          disabled={title.length === 0}

          onClick={handleSubmit}
        >
          Save
        </Button>
      </form>
    </Modal>
  )
}

export default AddProjectModal
