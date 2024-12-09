import { Button, TextField } from '@mui/material'
import { useCallback, useContext, useEffect, useState } from 'react'

import { context } from 'Context'
import database from 'database'
import { ButtonWrapper, TaskStatusSelector } from 'sharedComponents'
import { ETaskStatus, type TTask } from 'types'
import Modal from './Modal'

interface Props {
  taskId: string
}

const EditTaskModal = ({ taskId }: Props) => {
  const { dispatch } = useContext(context)
  const [title, setTitle] = useState<string>('')
  const [details, setDetails] = useState<string>('')
  const [status, setStatus] = useState<ETaskStatus>(ETaskStatus.NEW)

  useEffect(() => {
    void database
      .tasks.where('id').equals(taskId).first()
      .then((t: TTask | undefined) => {
        if (!t) return

        setTitle(t.title)
        setStatus(t.status)
        setDetails(t.details ?? '')
      })
  }, [taskId])

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  const handleSubmit = useCallback(async () => {
    await database.tasks.where('id').equals(taskId).modify({ title, status, details })

    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch, taskId, status, title, details])

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
