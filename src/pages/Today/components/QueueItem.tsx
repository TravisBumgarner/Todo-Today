import { ChevronRight } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/CloseOutlined'
import EditIcon from '@mui/icons-material/Edit'
import { Box, Card, IconButton, TextField, Tooltip, Typography, css } from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'
import { useCallback, useContext, useState, type ChangeEvent } from 'react'

import { context } from 'Context'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { ModalID } from 'modals'
import { TaskStatusSelector } from 'sharedComponents'
import { ETaskStatus, type TProject, type TTask, type TTodoListItem } from 'types'

export interface QueueItemEntry {
  id: string
}

interface Data {
  taskId: string
  todoListDate: string
  taskTitle: string
  taskStatus: ETaskStatus
  projectTitle: string
  taskDetails?: string
}

const EMPTY_STATE = {
  taskId: '',
  todoListDate: '',
  taskTitle: '',
  taskStatus: ETaskStatus.NEW,
  projectTitle: '',
  taskDetails: ''
}

const QueueItem = ({ id }: QueueItemEntry) => {
  const [data, setData] = useState<Data>(EMPTY_STATE)
  const [showDetails, setShowDetails] = useState(false)
  const [details, setDetails] = useState('') // Undo doesn't work if synced directly to DB. Might be a more elegant solution, but for now, this works.
  const { dispatch } = useContext(context)

  useLiveQuery(
    async () => {
      const todoListItem = await database.todoListItems.where('id').equals(id).first() as TTodoListItem
      const task = await database.tasks.where('id').equals(todoListItem.taskId).first() as TTask
      const project = await database.projects.where('id').equals(task.projectId).first() as TProject

      setData({
        ...todoListItem,
        taskTitle: task.title,
        taskStatus: task.status,
        projectTitle: project.title,
        taskDetails: task.details
      })
      setShowDetails(!!task.details && task.details.length > 0)
    }, [id])

  const toggleShowDetails = useCallback(() => { setShowDetails(prev => !prev) }, [])

  const handleStatusChange = useCallback(async (
    status: ETaskStatus
  ) => {
    if (status === null) return
    await database.tasks.where('id').equals(data.taskId).modify({ status })
  }, [data])

  const handleDetailsChange = useCallback(async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    void database.tasks.where('id').equals(data.taskId).modify({ details: event.target.value })
    setDetails(event.target.value)
  }, [data.taskId])

  const handleRemoveFromToday = useCallback(async () => {
    await database.todoListItems.where({ id }).delete()
  }, [id])

  const handleEdit = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.EDIT_TASK_MODAL, taskId: data.taskId } })
  }, [dispatch, data.taskId])

  return (
    <Card css={wrapperCSS}>
      <Box css={headerCSS(showDetails)}>
        <Box css={leftHeaderCSS}>
          <TaskStatusSelector handleStatusChangeCallback={handleStatusChange} taskStatus={data.taskStatus} showLabel={false} />
          <Box css={{ marginLeft: '1rem' }}>
            <Typography css={headerTextCSS} variant="h2">{data.taskTitle}</Typography>
            <Typography variant="body1">{data.projectTitle}</Typography>
          </Box>
        </Box>
        <Box css={rightHeaderCSS}>
          <ToggleButton
            size='small'
            value="text"
            onChange={toggleShowDetails}
            css={{ marginRight: '0.5rem', backgroundColor: 'css={css`background-color: var(--mui-palette-background-paper)' }}
          >
            <Tooltip title="Show details" >
              <ChevronRight fontSize="small" css={{ transform: `rotate(${showDetails ? '90deg' : '0deg'})` }} />
            </Tooltip>
          </ToggleButton>

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
      {showDetails && <TextField placeholder="Task Notes" css={detailsCSS} fullWidth multiline value={details} onChange={handleDetailsChange} />}
    </Card >
  )
}

const rightHeaderCSS = css`
  margin-left: 1rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const headerCSS = (showDetails: boolean) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${showDetails ? '0.5rem' : '0'};
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
