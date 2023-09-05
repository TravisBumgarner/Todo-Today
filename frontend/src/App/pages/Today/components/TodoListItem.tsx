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
import NotesIcon from '@mui/icons-material/Notes'
import ShortTextIcon from '@mui/icons-material/ShortText'

import database from 'database'
import { ETaskStatus, type TProject, type TTask, type TTodoListItem } from 'sharedTypes'
import { ModalID } from 'modals'
import { context } from 'Context'
import { useLiveQuery } from 'dexie-react-hooks'
import { EmptyStateDisplay } from 'sharedComponents'

type TodoListItemProps = TTodoListItem

const TodoListItem = ({ id, taskId, details: defaultDetails, sortOrder }: TodoListItemProps) => {
  const { dispatch } = useContext(context)
  const [details, setDetails] = useState(defaultDetails)
  const [showDetails, setShowDetails] = useState(defaultDetails.length > 0)

  const metadata = useLiveQuery<{ project: TProject, task: TTask }>(
    async () => {
      const task = await database.tasks.where('id').equals(taskId).first() as TTask
      const project = await database.projects.where('id').equals(task.projectId).first() as TProject
      return { task, project }
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
    // Undo doesn't work if synced directly to DB. Might be a more elegant solution, but for now, this works.
    void database.todoListItems.where('id').equals(id).modify({ details: event.target.value })
    setDetails(event.target.value)
  }, [id])

  const handleRemoveFromToday = useCallback(async () => {
    await database.todoListItems.where({ id }).delete()
  }, [id])

  const handleEdit = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.EDIT_TASK, data: { taskId } } })
  }, [dispatch, taskId])

  if (!metadata) {
    return <EmptyStateDisplay message='Unable to find project or task details' />
  }

  const { project, task } = metadata

  return (
    <Card css={wrapperCSS}>
      <Box css={headerCSS(showDetails)}>
        <Box>
          <Typography variant="h2">{task.title}</Typography>
          <Typography variant="body1">{project.title}</Typography>
        </Box>
        <Box css={rightHeaderCSS}>
          <ToggleButton
            size='small'
            value="text"
            onChange={toggleShowDetails}
            css={{ marginRight: '0.5rem' }}
          >
            <Tooltip title="Toggle Details">
              {details.length === 0 ? <ShortTextIcon fontSize="small" /> : <NotesIcon fontSize="small" />}
            </Tooltip>
          </ToggleButton>

          <ToggleButtonGroup
            value={task.status}
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

          <IconButton onClick={handleEdit} css={{ marginLeft: '0.5rem' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton onClick={handleRemoveFromToday} css={{ marginLeft: '0.5rem' }}>
            <CloseIcon fontSize="small" />
          </IconButton>

        </Box>
      </Box>
      {showDetails && <TextField fullWidth multiline value={details} onChange={handleDetailsChange} />}
    </Card>
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
  margin-bottom: ${showDetails ? '0.5rem' : 0};
`

const wrapperCSS = css`
  background-color: var(--mui-palette-background-paper);
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0 0 1rem 0;
`

export default TodoListItem
