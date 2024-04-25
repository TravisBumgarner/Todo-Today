import { type ChangeEvent, useState, useCallback, useContext } from 'react'
import { Box, Card, IconButton, TextField, Tooltip, Typography, css } from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/CloseOutlined'
import { ChevronRight } from '@mui/icons-material'

import database from 'database'
import { type ETaskStatus, type Entry } from 'types'
import { ModalID } from 'modals'
import { context } from 'Context'
import { TaskStatusSelector } from 'sharedComponents'

const QueueItem = ({ id, taskId, taskDetails: initialDetails, taskStatus, taskTitle, projectTitle }: Entry) => {
  const { dispatch } = useContext(context)
  const [details, setDetails] = useState(initialDetails ?? '') // Undo doesn't work if synced directly to DB. Might be a more elegant solution, but for now, this works.

  const handleStatusChange = useCallback(async (
    status: ETaskStatus
  ) => {
    if (status === null) return
    await database.tasks.where('id').equals(taskId).modify({ status })
  }, [taskId])

  const handleDetailsChange = useCallback(async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    void database.tasks.where('id').equals(taskId).modify({ details: event.target.value })
    setDetails(event.target.value)
  }, [taskId])

  const handleRemoveFromToday = useCallback(async () => {
    await database.todoListItems.where({ id }).delete()
  }, [id])

  const handleEdit = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.EDIT_TASK_MODAL, taskId } })
  }, [dispatch, taskId])

  return (
    <Card css={wrapperCSS}>
      <Box css={headerCSS}>
        <Box css={leftHeaderCSS}>
          <Box>
            <TaskStatusSelector handleStatusChangeCallback={handleStatusChange} taskStatus={taskStatus} showLabel={false} />
          </Box>
          <Box css={css`margin-left: 1rem`}>
            <Typography css={headerTextCSS} variant="h2">{taskTitle}</Typography>
            <Typography variant="body1">{projectTitle}</Typography>
          </Box>
        </Box>
        <Box css={rightHeaderCSS}>
          <Tooltip title="Edit task">
            <IconButton onClick={handleEdit} css={{ marginLeft: '0.5rem' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Remove from today">
            <IconButton onClick={handleRemoveFromToday} css={{ marginLeft: '0.5rem' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>

        </Box>
      </Box>
      <TextField rows={5} placeholder="Task Notes" css={detailsCSS} fullWidth multiline value={details} onChange={handleDetailsChange} />
    </Card >
  )
}

const rightHeaderCSS = css`
  margin-left: 1rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const headerCSS = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`

const detailsCSS = css`
  background: var(--mui-palette-background-paper);
`

const headerTextCSS = css`
  font-size: 1.5rem;
  color: var(--mui-palette-text-primary);
`

const leftHeaderCSS = css`
  display: flex;
  align-items: center;
`

export const TODO_LIST_ITEM_MARGIN = '0.5rem 0 0.5rem 0'

const wrapperCSS = css`
background: var(--mui-palette-background-paper);
border-radius: 0.5rem;
padding: 0.5rem;
margin: ${TODO_LIST_ITEM_MARGIN};
`

export default QueueItem
