import CloseIcon from '@mui/icons-material/CloseOutlined'
import EditIcon from '@mui/icons-material/Edit'
import { Box, Card, IconButton, TextField, Tooltip, Typography, css } from '@mui/material'
import { useCallback, useContext, useState, type ChangeEvent } from 'react'

import { context } from 'Context'
import database from 'database'
import { ModalID } from 'modals'
import { TaskStatusSelector } from 'sharedComponents'
import { type ETaskStatus, type TDateISODate } from 'types'

export interface DoModeEntry {
  id: string
  taskId: string
  todoListDate: string
  taskTitle: string
  taskStatus: ETaskStatus
  projectTitle: string
  taskDetails?: string
  selectedDate: TDateISODate
  todoListItemId: string
}

const QueueItem = ({ id, taskId, taskDetails: initialDetails, taskStatus, taskTitle, projectTitle }: DoModeEntry) => {
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

const wrapperCSS = css`
background: var(--mui-palette-background-paper);
border-radius: 0.5rem;
padding: 0.5rem;
margin-bottom: 0.5rem;
`

export default QueueItem
