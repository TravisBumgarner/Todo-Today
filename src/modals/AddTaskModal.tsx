import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { Box, Button, InputLabel, TextField, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'
import { useCallback, useState } from 'react'
import { v4 as uuid4 } from 'uuid'

import ButtonWrapper from 'components/ButtonWrapper'
import TaskStatusSelector from 'components/TaskStatusSelector'
import { queries } from 'database'
import { ETaskStatus, type TTask } from 'types'
import { activeModalSignal, selectedDateSignal } from '../signals'
import Modal from './Modal'

const AddTaskModal = () => {
  const [title, setTitle] = useState<string>('')
  const [status, setStatus] = useState<ETaskStatus>(ETaskStatus.NEW)
  const [details, setDetails] = useState<string>('')
  const [addToSelectedDate, setAddToSelectedDate] = useState<'yes' | 'no'>('yes')

  const handleCancel = useCallback(() => {
    activeModalSignal.value = null
  }, [])

  const handleSubmit = async () => {
    const taskId = uuid4()
    const newTask: TTask = {
      title,
      status,
      id: taskId,
      details,
      subtasks: []
    }

    await queries.addTask(newTask)
    if (addToSelectedDate === 'yes') await queries.addTaskToTodoList(selectedDateSignal.value, taskId)

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
          variant='outlined'
          color='warning'
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
