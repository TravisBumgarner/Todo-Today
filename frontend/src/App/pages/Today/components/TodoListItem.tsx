import { type ChangeEvent, useState, type MouseEvent, useCallback } from 'react'
import { Box, Card, FormControlLabel, IconButton, Switch, TextField, Tooltip, Typography, css } from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import DeleteIcon from '@mui/icons-material/Delete'
import DoneIcon from '@mui/icons-material/Done'
import RemoveDoneIcon from '@mui/icons-material/RemoveDone'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CloseIcon from '@mui/icons-material/CloseOutlined'

import database from 'database'
import { ETaskStatus } from 'sharedTypes'

interface TodoListItemProps {
  taskStatus: ETaskStatus
  taskId: string
  taskTitle: string
  projectTitle: string
  details: string
  projectId: string
  id: string
  sortOrder: number
}

const TodoListItem = ({ id, taskId, taskStatus: defaultTaskStatus, details: defaultDetails, taskTitle, projectTitle, sortOrder }: TodoListItemProps) => {
  const [taskStatus, setTaskStatus] = useState(defaultTaskStatus)
  const [details, setDetails] = useState(defaultDetails)
  const [showDetails, setShowDetails] = useState(defaultDetails.length > 0)

  const toggleShowDetails = useCallback(() => { setShowDetails(prev => !prev) }, [])

  const handleStatusChange = useCallback(async (
    event: MouseEvent<HTMLElement>,
    status: ETaskStatus
  ) => {
    if (status === null) return

    // For whatever reason, Dexie does not seem to want to liveSync updates. Therefore, we'll keep track
    // of the value locally, and also sync it to Dexie.
    await database.tasks.where('id').equals(taskId).modify({ status })

    if (status === ETaskStatus.COMPLETED || status === ETaskStatus.CANCELED) {
      const lastTodoListItem = await database.todoListItems.orderBy('sortOrder').reverse().first()
      const sortOrder = lastTodoListItem?.sortOrder ? lastTodoListItem?.sortOrder + 1 : 0
      await database.todoListItems.where('id').equals(id).modify({ sortOrder })
    }

    setTaskStatus(status)
  }, [taskId, id])

  const handleDetailsChange = useCallback(async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    // For whatever reason, Dexie does not seem to want to liveSync updates. Therefore, we'll keep track
    // of the value locally, and also sync it to Dexie.
    void database.todoListItems.where('id').equals(id).modify({ details: event.target.value })
    console.log('event.target.value', event.target.value)
    setDetails(event.target.value)
  }, [id])

  const handleRemoveFromToday = useCallback(async () => {
    await database.todoListItems.where({ id }).delete()
  }, [id])

  return (
    <Card css={wrapperCSS}>
      <Box css={headerCSS(showDetails)}>
        <Typography variant="h4" css={titleCSS(taskStatus)}>{taskTitle} - {projectTitle} (sort Order, {sortOrder})</Typography>
        <Box css={rightHeaderCSS}>
          <FormControlLabel control={<Switch color="secondary" checked={showDetails} onChange={toggleShowDetails} />} label="Details" />
          <ToggleButtonGroup
            value={taskStatus}
            exclusive
            onChange={handleStatusChange}
            size="small"
          >
            <ToggleButton color="error" size='small' value={ETaskStatus.CANCELED}>
              <Tooltip title="Canceled">
                <DeleteIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton color="warning" size='small' value={ETaskStatus.BLOCKED}>
              <Tooltip title="Blocked">
                <RemoveDoneIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton color="secondary" size='small' value={ETaskStatus.NEW}>
              <Tooltip title="Todo">
                <CheckBoxOutlineBlankIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton color="secondary" size='small' value={ETaskStatus.IN_PROGRESS}>
              <Tooltip title="Doing">
                <LightbulbIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton color="secondary" size='small' value={ETaskStatus.COMPLETED}>
              <Tooltip title="Done">
                <DoneIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
          <IconButton onClick={handleRemoveFromToday} css={{ marginLeft: '1rem' }}>
            <CloseIcon fontSize="small" style={{ color: 'var(--mui-palette-primary-main)' }} />
          </IconButton>

        </Box>
      </Box>
      {showDetails && <TextField color='secondary' fullWidth multiline value={details} onChange={handleDetailsChange} />}
    </Card>
  )
}

const getTitleColor = (taskStatus: ETaskStatus) => {
  switch (taskStatus) {
    case ETaskStatus.CANCELED:
      return 'var(--mui-palette-error-main)'
    case ETaskStatus.BLOCKED:
      return 'var(--mui-palette-warning-main)'
    case ETaskStatus.COMPLETED:
      return 'var(--mui-palette-secondary-main)'
    case ETaskStatus.IN_PROGRESS:
      return 'var(--mui-palette-secondary-main)'
    default:
      return 'var(--mui-palette-secondary-main)'
  }
}

const titleCSS = (taskStatus: ETaskStatus) => css`
  color: ${getTitleColor(taskStatus)};
`

const rightHeaderCSS = css`
  min-width: 295px;
  margin-left: 1rem;
  display: flex;
  align-items: center;
`

const headerCSS = (showDetails: boolean) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${showDetails ? '0.5rem' : 0};
`

const wrapperCSS = css`
  background-color: var(--mui-palette-primary-dark);
  color: var(--mui-palette-secondary-main);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin: 0.5rem 0;
`

export default TodoListItem
