import { type ChangeEvent, useState, useCallback, useContext } from 'react'
import { Box, Button, ButtonGroup, IconButton, Stack, TextField, Tooltip, Typography, css } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
// import CloseIcon from '@mui/icons-material/CloseOutlined'

import database from 'database'
import { ETaskStatus, type TTask, type TDateISODate, type TTodoListItem } from 'types'
import { ModalID } from 'modals'
import { context } from 'Context'
import { Icons } from 'sharedComponents'
import { getNextSortOrderValue, taskStatusIcon } from 'utilities'

export interface Entry {
  id: string
  taskId: string
  todoListDate: string
  sortOrder: number
  taskTitle: string
  taskStatus: ETaskStatus
  projectTitle: string
  taskDetails?: string
  selectedDate: TDateISODate
}

const QueueItem = ({ id, taskId, taskDetails: initialDetails, taskStatus, taskTitle, projectTitle, selectedDate }: Entry) => {
  const { dispatch } = useContext(context)
  const [details, setDetails] = useState(initialDetails ?? '') // Undo doesn't work if synced directly to DB. Might be a more elegant solution, but for now, this works.

  const handleStatusChange = useCallback(async (
    status: ETaskStatus
  ) => {
    if (status === null) return
    const taskDTO: Partial<TTask> = { status }
    await database.tasks.where('id').equals(taskId).modify(taskDTO)
  }, [taskId])

  const handleSortOrderChange = useCallback(async (
  ) => {
    const nextSorterOrder = await getNextSortOrderValue(selectedDate)
    const todoListItemDTO: Partial<TTodoListItem> = { sortOrder: nextSorterOrder }
    await database.todoListItems.where('id').equals(id).modify(todoListItemDTO)
  }, [selectedDate, id])

  const markCompleted = useCallback(() => {
    void handleStatusChange(ETaskStatus.COMPLETED)
  }, [handleStatusChange])

  const markCanceled = useCallback(() => {
    void handleStatusChange(ETaskStatus.CANCELED)
  }, [handleStatusChange])

  const markBlocked = useCallback(() => {
    void handleSortOrderChange()
    void handleStatusChange(ETaskStatus.BLOCKED)
  }, [handleStatusChange, handleSortOrderChange])

  const markQueued = useCallback(() => {
    void handleSortOrderChange()
    void handleStatusChange(ETaskStatus.NEW)
  }, [handleStatusChange, handleSortOrderChange])

  const markSkipped = useCallback(() => {
    void handleSortOrderChange()
  }, [handleSortOrderChange])

  const handleDetailsChange = useCallback(async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    void database.tasks.where('id').equals(taskId).modify({ details: event.target.value })
    setDetails(event.target.value)
  }, [taskId])

  // const handleRemoveFromToday = useCallback(async () => {
  //   await database.todoListItems.where({ id }).delete()
  // }, [id])

  const handleEdit = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.EDIT_TASK_MODAL, taskId } })
  }, [dispatch, taskId])

  return (
    <Box css={wrapperCSS}>
      <Box css={headerCSS}>
        <Box css={leftHeaderCSS}>
          <Box>
            <Typography css={headerTextCSS} variant="h2">{taskTitle}</Typography>
            <Typography variant="body1">{projectTitle}</Typography>
          </Box>
          <Typography css={css`margin-left: 3rem;`}>Current Status</Typography>{taskStatusIcon(taskStatus)}
        </Box>
        <Box css={rightHeaderCSS}>
          <Tooltip title="Edit task">
            <IconButton onClick={handleEdit} css={{ marginLeft: '0.5rem' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* <Tooltip title="Remove from today">
            <IconButton onClick={handleRemoveFromToday} css={{ marginLeft: '0.5rem' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip> */}

        </Box>
      </Box>
      <TextField css={detailsCSS} placeholder='Details' fullWidth multiline value={details} onChange={handleDetailsChange} />
      <Box>
        <Stack direction="row" css={css`align-items: center; display: flex; margin-top: 1rem; > * {margin-right: 0.5rem;}`}>
          <ButtonGroup variant='contained'>
            {/* <Button startIcon={<Icons.NewIcon />} onClick={markQueued}>Back to Queue</Button> */}
            <Button startIcon={<Icons.BlockedIcon />} onClick={markBlocked}>Pause Task</Button>
            <Button startIcon={<Icons.CanceledIcon />} onClick={markCanceled}>Cancel Task</Button>
            <Button startIcon={<Icons.CompletedIcon />} onClick={markCompleted} >Complete Task</Button>
          </ButtonGroup>
          <Typography variant='body1'>Or</Typography>
          <Button variant='contained' onClick={markSkipped}>Work on task later</Button>
        </Stack>
      </Box>
    </Box >
  )
}

const rightHeaderCSS = css`
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
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin: ${TODO_LIST_ITEM_MARGIN};
  border: 2px solid var(--mui-palette-primary-main);
  border-radius: 1rem;
`

export default QueueItem
