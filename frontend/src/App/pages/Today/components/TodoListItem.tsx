import { type ChangeEvent, useState, type MouseEvent } from 'react'
import database from 'database'
import { Box, Container, TextField, Tooltip, Typography, css } from '@mui/material'
import PendingIcon from '@mui/icons-material/Pending'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import PsychologyIcon from '@mui/icons-material/Psychology'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelIcon from '@mui/icons-material/Cancel'
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled'

import { ETaskStatus } from 'sharedTypes'

interface TodoListItemProps {
  taskStatus: ETaskStatus
  taskId: string
  taskTitle: string
  projectTitle: string
  details: string
  projectId: string
  id: string
}

const TodoListItem = ({ id, taskId, taskStatus: defaultTaskStatus, details: defaultDetails, taskTitle, projectTitle }: TodoListItemProps) => {
  const [taskStatus, setTaskStatus] = useState(defaultTaskStatus)
  const [details, setDetails] = useState(defaultDetails)

  const handleStatusChange = async (
    event: MouseEvent<HTMLElement>,
    status: ETaskStatus
  ) => {
    // For whatever reason, Dexie does not seem to want to liveSync updates. Therefore, we'll keep track
    // of the value locally, and also sync it to Dexie.
    void database.tasks.where('id').equals(taskId).modify({ status })
    setTaskStatus(status)
  }

  const handleDetailsChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    // For whatever reason, Dexie does not seem to want to liveSync updates. Therefore, we'll keep track
    // of the value locally, and also sync it to Dexie.
    void database.todoListItems.where('id').equals(id).modify({ details: event.target.value })
    console.log('event.target.value', event.target.value)
    setDetails(event.target.value)
  }

  return (
    <Container css={wrapperCSS}>
      <Box css={headerCSS}>
        <Typography variant="h3">{taskTitle} - {projectTitle}</Typography>
        <ToggleButtonGroup
          value={taskStatus}
          exclusive
          onChange={handleStatusChange}
          aria-label="text alignment"
        >
          <ToggleButton value={ETaskStatus.NEW}>
            <Tooltip title="Pending">
              <PendingIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={ETaskStatus.IN_PROGRESS}>
            <Tooltip title="In Progress">
              <PsychologyIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={ETaskStatus.BLOCKED}>
            <Tooltip title="Blocked">
              <PauseCircleFilledIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={ETaskStatus.COMPLETED}>
            <Tooltip title="Completed">
              <CheckCircleOutlineIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={ETaskStatus.CANCELED}>
            <Tooltip title="Canceled">
              <CancelIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <TextField fullWidth multiline value={details} onChange={handleDetailsChange} />
    </Container>
  )
}

const headerCSS = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const wrapperCSS = css`
  border: 2px solid black;
  border-radius: 5px;
  padding: 1rem;
  margin: 1rem 0;
`

export default TodoListItem
