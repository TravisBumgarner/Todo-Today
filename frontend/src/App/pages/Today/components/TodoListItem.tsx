import { type ChangeEvent, useState, type MouseEvent, useCallback } from 'react'
import database from 'database'
import { Box, Card, FormControlLabel, Switch, TextField, Tooltip, Typography, css } from '@mui/material'
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
  const [showDetails, setShowDetails] = useState(defaultDetails.length > 0)

  const toggleShowDetails = useCallback(() => { setShowDetails(prev => !prev) }, [])

  const handleStatusChange = useCallback(async (
    event: MouseEvent<HTMLElement>,
    status: ETaskStatus
  ) => {
    // For whatever reason, Dexie does not seem to want to liveSync updates. Therefore, we'll keep track
    // of the value locally, and also sync it to Dexie.
    void database.tasks.where('id').equals(taskId).modify({ status })
    setTaskStatus(status)
  }, [taskId])

  const handleDetailsChange = useCallback(async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    // For whatever reason, Dexie does not seem to want to liveSync updates. Therefore, we'll keep track
    // of the value locally, and also sync it to Dexie.
    void database.todoListItems.where('id').equals(id).modify({ details: event.target.value })
    console.log('event.target.value', event.target.value)
    setDetails(event.target.value)
  }, [id])

  return (
    <Card css={wrapperCSS}>
      <Box css={headerCSS}>
        <Typography variant="h4">{taskTitle} - {projectTitle}</Typography>
        <Box css={rightHeaderCSS}>
          <FormControlLabel control={<Switch checked={showDetails} onChange={toggleShowDetails} />} label="Show Details" />
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
      </Box>
      {showDetails && <TextField fullWidth multiline value={details} onChange={handleDetailsChange} />}
    </Card>
  )
}

const rightHeaderCSS = css`
  width: 410px;
  min-width: 410px;
  display: flex;
  align-items: center;
`

const headerCSS = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`

const wrapperCSS = css`
  background-color: var(--mui-palette-primary-main);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin: 0.5rem;
`

export default TodoListItem
