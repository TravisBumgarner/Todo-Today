import { type ChangeEvent, useState, type MouseEvent, useCallback, useContext } from 'react'
import { Box, Card, IconButton, TextField, Tooltip, Typography, css } from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import DeleteIcon from '@mui/icons-material/Delete'
import DoneIcon from '@mui/icons-material/Done'
import EditIcon from '@mui/icons-material/Edit'
import RemoveDoneIcon from '@mui/icons-material/RemoveDone'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CloseIcon from '@mui/icons-material/CloseOutlined'
import { ChevronRight } from '@mui/icons-material'

import database from 'database'
import { ETaskStatus, type TProject, type TTodoListItem } from 'sharedTypes'
import { ModalID } from 'modals'
import { context } from 'Context'
import { useLiveQuery } from 'dexie-react-hooks'
import { EmptyStateDisplay } from 'sharedComponents'

type TodoListItemProps = TTodoListItem

interface Metadata { taskId: string, projectTitle: string, taskTitle: string, taskStatus: ETaskStatus }

const colorStatus: Record<ETaskStatus, 'secondary' | 'primary' | 'warning' | 'error'> = {
  [ETaskStatus.NEW]: 'secondary',
  [ETaskStatus.IN_PROGRESS]: 'secondary',
  [ETaskStatus.COMPLETED]: 'secondary',
  [ETaskStatus.BLOCKED]: 'warning',
  [ETaskStatus.CANCELED]: 'error'
} as const

const TodoListItem = ({ id, taskId }: TodoListItemProps) => {
  const { dispatch } = useContext(context)
  const [showDetails, setShowDetails] = useState(false)
  const [metadata, setMetadata] = useState<Metadata>({} as Metadata)
  const [details, setDetails] = useState('') // Undo doesn't work if synced directly to DB. Might be a more elegant solution, but for now, this works.

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
      setDetails(task.details)
      task.details.length > 0 && setShowDetails(true)
    })

  const toggleShowDetails = useCallback(() => { setShowDetails(prev => !prev) }, [])

  const handleStatusChange = useCallback(async (
    event: MouseEvent<HTMLElement>,
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
    void database.tasks.where('id').equals(metadata.taskId).modify({ details: event.target.value })
    setDetails(event.target.value)
  }, [metadata.taskId])

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
    <Card css={gradientWrapperCSS(metadata.taskStatus)}>
      <Box css={wrapperCSS}>
        <Box css={headerCSS(showDetails)}>
          <Box>
            <Typography css={headerTextCSS(metadata.taskStatus)} variant="h2">{metadata.taskTitle}</Typography>
            <Typography variant="body1">{metadata.projectTitle}</Typography>
          </Box>
          <Box css={rightHeaderCSS}>
            <ToggleButton
              size='small'
              value="text"
              onChange={toggleShowDetails}
              css={{ marginRight: '0.5rem', backgroundColor: 'css={css`background-color: var(--mui-palette-background-paper)' }}
            >
              <Tooltip title="Show Details" >
                <ChevronRight fontSize="small" css={{ transform: `rotate(${showDetails ? '90deg' : '0deg'})` }} />
              </Tooltip>
            </ToggleButton>

            <ToggleButtonGroup
              value={metadata.taskStatus}
              exclusive
              onChange={handleStatusChange}
              size="small"
            >
              <ToggleButton color={colorStatus[ETaskStatus.CANCELED]} size='small' value={ETaskStatus.CANCELED}>
                <Tooltip title="Canceled">
                  <DeleteIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton color={colorStatus[ETaskStatus.BLOCKED]} size='small' value={ETaskStatus.BLOCKED}>
                <Tooltip title="Blocked">
                  <RemoveDoneIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton color={colorStatus[ETaskStatus.NEW]} size='small' value={ETaskStatus.NEW}>
                <Tooltip title="Todo">
                  <CheckBoxOutlineBlankIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton color={colorStatus[ETaskStatus.IN_PROGRESS]} size='small' value={ETaskStatus.IN_PROGRESS}>
                <Tooltip title="Doing">
                  <LightbulbIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton color={colorStatus[ETaskStatus.COMPLETED]} size='small' value={ETaskStatus.COMPLETED}>
                <Tooltip title="Done">
                  <DoneIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>

            <IconButton onClick={handleEdit} css={{ marginLeft: '0.5rem' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton onClick={handleRemoveFromToday} css={{ marginLeft: '0.5rem' }}>
              <CloseIcon fontSize="small" />
            </IconButton>

          </Box>
        </Box>
        {showDetails && <TextField css={detailsCSS} fullWidth multiline value={details} onChange={handleDetailsChange} />}
      </Box>
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

const gradientWrapperCSS = (color: ETaskStatus) => css`
border-radius: 0.5rem;
padding: 0.5rem;
background: linear-gradient(90deg, var(--mui-palette-background-paper) 30%, var(--mui-palette-${colorStatus[color]}-main) 100%);
`

const headerTextCSS = (color: ETaskStatus) => css`
color: var(--mui-palette-${colorStatus[color]}-main);
`

const wrapperCSS = css`
background: var(--mui-palette-background-paper);
border-radius: 0.5rem;
padding: 0.5rem;
`

export default TodoListItem
