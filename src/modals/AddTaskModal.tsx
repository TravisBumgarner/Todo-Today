import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { Box, Button, InputLabel, TextField, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'
import { useCallback, useContext, useState } from 'react'
import { v4 as uuid4 } from 'uuid'

import { context } from 'Context'
import database from 'database'
import { ButtonWrapper, TaskStatusSelector } from 'sharedComponents'
import { ETaskStatus, type TTask } from 'types'
import { getNextSortOrderValue } from 'utilities'
import { activeModalSignal } from '../signals'
import Modal from './Modal'

const AddTaskModal = () => {
  const { state: { activeWorkspaceId } } = useContext(context)
  const [title, setTitle] = useState<string>('')
  const [status, setStatus] = useState<ETaskStatus>(ETaskStatus.NEW)
  const [details, setDetails] = useState<string>('')
  const [addToSelectedDate, setAddToSelectedDate] = useState<'yes' | 'no'>('yes')

  // Todo - Move to signal.
  const selectedDate = '2024-01-01'

  const handleCancel = useCallback(() => {
    activeModalSignal.value = null
  }, [])

  const handleSubmit = async () => {
    const taskId = uuid4()
    const newTask: TTask = {
      title,
      status,
      id: taskId,
      details
    }

    await database.tasks.add(newTask)

    if (addToSelectedDate === 'yes') {
      const nextSortOrder = await getNextSortOrderValue(selectedDate)
      await database.todoListItems.add({
        taskId,
        id: taskId,
        todoListDate: selectedDate,
        sortOrder: nextSortOrder,
        workspaceId: activeWorkspaceId
      })
    }

    activeModalSignal.value = null
  }

  const handleAddToTodayChange = useCallback((event: React.MouseEvent<HTMLElement>, newValue: 'yes' | 'no') => {
    if (newValue === null) return

    setAddToSelectedDate(newValue)
  }, [])

  return (
    <Modal
      title="Add New Task"
      showModal={true}
    >
      <TextField
        autoFocus
        multiline
        fullWidth
        label="Task"
        name="title"
        value={title}
        margin='normal'
        onChange={(event) => { setTitle(event.target.value) }}
      />
      <TaskStatusSelector taskStatus={status} handleStatusChangeCallback={setStatus} showLabel />
      <TextField
        multiline
        fullWidth
        label="Details"
        name="details"
        value={details}
        margin='normal'
        onChange={(event) => { setDetails(event.target.value) }}
      />
      <Box css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <InputLabel>Add to Today?</InputLabel>

        <ToggleButtonGroup value={addToSelectedDate} exclusive onChange={handleAddToTodayChange}>
          <ToggleButton color="primary" value='no' >
            <Tooltip title="Do not add to today">
              <CancelIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton color="primary" value='yes'>
            <Tooltip title="Add to today">
              <CheckCircleOutlineIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <ButtonWrapper>
        <Button
          key="cancel"
          fullWidth
          variant='contained'
          color='secondary'
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          type="button"
          variant='contained'
          disabled={title.length === 0}
          key="save"

          onClick={handleSubmit}
        >
          Save
        </Button>
      </ButtonWrapper>

    </Modal >
  )
}

export default AddTaskModal
