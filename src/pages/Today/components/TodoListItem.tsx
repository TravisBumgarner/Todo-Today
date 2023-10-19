import { type ChangeEvent, useState, useCallback, useContext } from 'react'
import { Box, Card, IconButton, TextField, Tooltip, Typography, css } from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/CloseOutlined'
import { ChevronRight } from '@mui/icons-material'
import TimerIcon from '@mui/icons-material/Timer'
import { useLiveQuery } from 'dexie-react-hooks'

import database from 'database'
import { ETaskStatus, type TProject, type TTodoListItem } from 'types'
import { ModalID } from 'modals'
import { context } from 'Context'
import { EmptyStateDisplay, TaskStatusSelector } from 'sharedComponents'

type TodoListItemProps = TTodoListItem

interface Metadata { taskId: string, projectTitle: string, taskTitle: string, taskStatus: ETaskStatus }

const TodoListItem = ({ id, taskId }: TodoListItemProps) => {
  const { dispatch } = useContext(context)
  const [showDetails, setShowDetails] = useState(false)
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [details, setDetails] = useState('') // Undo doesn't work if synced directly to DB. Might be a more elegant solution, but for now, this works.

  const handleStartTimer = () => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.TIMER_MODAL, taskId } })
  }

  useLiveQuery(
    async () => {
      const task = await database.tasks.where('id').equals(taskId).first()
      if (!task) {
        setMetadata({
          taskTitle: 'Unable to find task',
          projectTitle: 'Unable to find project',
          taskStatus: ETaskStatus.CANCELED,
          taskId: ''
        })
        return
      }

      const project = await database.projects.where('id').equals(task.projectId).first() as TProject
      setMetadata({ taskId: task.id, taskTitle: task.title, projectTitle: project.title, taskStatus: task.status })
      setDetails(task.details ?? '')
      task.details && task.details.length > 0 && setShowDetails(true)
    })

  const toggleShowDetails = useCallback(() => { setShowDetails(prev => !prev) }, [])

  const handleStatusChange = useCallback(async (
    status: ETaskStatus
  ) => {
    if (status === null) return
    await database.tasks.where('id').equals(taskId).modify({ status })

    if (status === ETaskStatus.COMPLETED || status === ETaskStatus.CANCELED) {
      const lastTodoListItem = await database.todoListItems.orderBy('sortOrder').reverse().first()
      const sortOrder = lastTodoListItem?.sortOrder ? lastTodoListItem?.sortOrder + 1 : 0
      await database.todoListItems.where('id').equals(id).modify({ sortOrder })

      setShowDetails(false)
    }
  }, [taskId, id])

  const handleDetailsChange = useCallback(async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (!metadata) return

    void database.tasks.where('id').equals(metadata.taskId).modify({ details: event.target.value })
    setDetails(event.target.value)
  }, [metadata])

  const handleRemoveFromToday = useCallback(async () => {
    await database.todoListItems.where({ id }).delete()
  }, [id])

  const handleEdit = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.EDIT_TASK_MODAL, taskId } })
  }, [dispatch, taskId])

  if (!metadata) {
    return <EmptyStateDisplay message='Unable to find project or task details' />
  }
  return (
    <Card css={wrapperCSS}>
      <Box css={headerCSS(showDetails)}>
        <Box css={leftHeaderCSS}>
          <Box>
            <TaskStatusSelector handleStatusChangeCallback={handleStatusChange} taskStatus={metadata.taskStatus} showLabel={false} />
          </Box>
          <Box css={css`margin-left: 1rem`}>
            <Typography css={headerTextCSS} variant="h2">{metadata.taskTitle}</Typography>
            <Typography variant="body1">{metadata.projectTitle}</Typography>
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

          <Tooltip title="Start focus timer">
            <IconButton onClick={handleStartTimer} css={{ marginLeft: '0.5rem' }}>
              <TimerIcon fontSize="small" />
            </IconButton>
          </Tooltip>

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
      {showDetails && <TextField css={detailsCSS} fullWidth multiline value={details} onChange={handleDetailsChange} />}
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
`

export default TodoListItem
