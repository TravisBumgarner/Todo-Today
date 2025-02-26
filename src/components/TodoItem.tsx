import { Add, ChevronRight, Delete, Edit } from '@mui/icons-material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/CloseOutlined'
import { Box, Card, Checkbox, css, FormControlLabel, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'
import TaskStatusSelector from 'components/TaskStatusSelector'
import { database, queries } from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { type ChangeEvent, useCallback, useState } from 'react'
import { SPACING } from 'theme'
import { ETaskStatus } from 'types'
import { v4 as uuidv4 } from 'uuid'
import { selectedDateSignal } from '../signals'

export interface TTodoItem {
  taskId: string
}

const Subtask = ({ taskId, subtaskId }: { taskId: string, subtaskId: string }) => {
  const subtask = useLiveQuery(async () => await queries.getSubtask(taskId, subtaskId))

  const handleSubtaskChange = useCallback(async () => {
    await queries.updateSubtask(taskId, subtaskId, { checked: !subtask?.checked })
  }, [taskId, subtaskId, subtask])

  const handleDeleteSubtask = useCallback(async () => {
    await queries.deleteSubtask(taskId, subtaskId)
  }, [taskId, subtaskId])

  if (!subtask) return null

  return (
    <Box css={subtaskWrapperCSS}>
      <FormControlLabel control={
        <Checkbox
          sx={{
            color: 'var(--mui-palette-info)',
            '&.Mui-checked': {
              color: 'var(--mui-palette-info)'
            }
          }}
          checked={subtask?.checked}
          onChange={handleSubtaskChange}
          style={{ padding: `${SPACING.XXSMALL}px ${SPACING.SMALL}px` }}
        />
      }
        label={subtask?.title}
      />
      <IconButton onClick={handleDeleteSubtask}><Delete color='info' fontSize="small" /></IconButton>
    </Box>
  )
}

const subtaskWrapperCSS = css`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
`

const TodoItem = ({ taskId }: TTodoItem) => {
  const [showContent, setShowContent] = useState(false)
  const [details, setDetails] = useState('') // Undo doesn't work if synced directly to DB. Might be a more elegant solution, but for now, this works.
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [tempTitle, setTempTitle] = useState('')
  const [status, setStatus] = useState(ETaskStatus.NEW)
  const [subtaskIds, setSubtaskIds] = useState<string[]>([])
  const [subtaskTitle, setSubtaskTitle] = useState('')

  useLiveQuery(() => {
    void database.tasks.where('id').equals(taskId).first().then((task) => {
      setTempTitle(task?.title ?? '')
      setStatus(task?.status ?? ETaskStatus.NEW)
      setDetails(task?.details ?? '')
      const hasTasksOrDetails = !!task?.details || (task?.subtasks?.length ?? 0) > 0
      const isActive = [ETaskStatus.IN_PROGRESS, ETaskStatus.NEW, ETaskStatus.BLOCKED].includes(task?.status ?? ETaskStatus.NEW)
      setShowContent(hasTasksOrDetails && isActive)
      setSubtaskIds(task?.subtasks?.map(subtask => subtask.id) ?? [])
    })
  })

  const toggleContent = useCallback(() => { setShowContent(prev => !prev) }, [])

  const handleSubtaskTitleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSubtaskTitle(event.target.value)
  }, [])

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
    const todoList = await database.todoList.where('date').equals(selectedDateSignal.value).first()
    await database.todoList.where('date').equals(selectedDateSignal.value).modify({ taskIds: todoList?.taskIds.filter(id => id !== taskId) ?? [] })
  }, [taskId])

  const handleEdit = useCallback(() => {
    setIsEditingTitle(true)
  }, [])

  const handleSaveTitle = useCallback(async () => {
    await database.tasks.where('id').equals(taskId).modify({ title: tempTitle })
    setIsEditingTitle(false)
  }, [taskId, tempTitle])

  const handleCancel = useCallback(() => {
    setIsEditingTitle(false)
  }, [])

  const handleTempTitleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTempTitle(event.target.value)
  }, [])

  const handleAddSubtask = useCallback(async () => {
    await queries.insertSubtask(taskId, { id: uuidv4(), title: subtaskTitle, checked: false })
    setSubtaskTitle('')
  }, [taskId, subtaskTitle])

  return (
    <Card css={wrapperCSS}>
      <Box css={headerCSS(showContent)}>
        <Box css={leftHeaderCSS}>
          <Box>
            <TaskStatusSelector handleStatusChangeCallback={handleStatusChange} taskStatus={status} showLabel={false} />
          </Box>
          <Box css={{ marginLeft: '1rem' }}>
            {
              isEditingTitle
                ? <Box css={textEditWrapperCSS}>
                  <TextField size='small' fullWidth value={tempTitle} onChange={handleTempTitleChange} />
                  <IconButton onClick={handleSaveTitle}><CheckIcon fontSize="small" /></IconButton>
                  <IconButton onClick={handleCancel}><CloseIcon fontSize="small" /></IconButton>
                </Box>
                : <Box css={readonlyTextWrapperCSS}>
                  <Typography css={headerTextCSS} variant="h2">{tempTitle}</Typography>
                  <IconButton onClick={handleEdit} css={textEditButtonCSS}><Edit fontSize="small" /></IconButton>
                </Box>
            }
          </Box>
        </Box>
        <Box css={rightHeaderCSS}>
          <ToggleButton
            size='small'
            value="text"
            onChange={toggleContent}
            css={{ marginRight: '0.5rem', backgroundColor: 'css={css`background-color: var(--mui-palette-background-paper)' }}
          >
            <Tooltip title="Show details" >
              <ChevronRight color={showContent ? 'primary' : 'info'} fontSize="small" css={{ transform: `rotate(${showContent ? '90deg' : '0deg'})` }} />
            </Tooltip>
          </ToggleButton>

          <Tooltip title="Remove from today">
            <IconButton onClick={handleRemoveFromToday} css={{ marginLeft: '0.5rem' }}>
              <CloseIcon color='warning' fontSize="small" />
            </IconButton>
          </Tooltip>

        </Box>
      </Box>
      {showContent && <Box css={contentWrapperCSS}>
        <TextField placeholder="Notes" css={detailsCSS} fullWidth rows={4} multiline value={details} onChange={handleDetailsChange} />
        <Box>
          <Box>
            <Box css={subtaskInputWrapperCSS}>
              <TextField size='small' fullWidth type="text" placeholder="Subtask" value={subtaskTitle} onChange={handleSubtaskTitleChange} />
              <Tooltip title="Add subtask">
                <span>
                  <IconButton color={subtaskTitle.length === 0 ? 'info' : 'primary'} disabled={subtaskTitle.length === 0} onClick={handleAddSubtask}><Add fontSize="small" /></IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
          <Box css={subtaskListCSS}>
            {subtaskIds.map((subtaskId) => (
              <Subtask key={subtaskId} taskId={taskId} subtaskId={subtaskId} />
            ))}
          </Box>
        </Box>
      </Box>}
    </Card>
  )
}

const subtaskListCSS = css`
  display: flex;
  flex-direction: column;
`

const subtaskInputWrapperCSS = css`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
`

const contentWrapperCSS = css`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;

  & > div {
    flex: 1;
  }
`

const textEditButtonCSS = css`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
`

const textEditWrapperCSS = css`
  display: flex;
  align-items: center;
`

const readonlyTextWrapperCSS = css`
  display: flex;
  align-items: center;
  button {
  margin-left: ${SPACING.XSMALL}px;
  display: none;
}

  &:hover {
    button {
    display: block;
    }
  }
`

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

export default TodoItem
