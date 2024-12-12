import { ChevronRight } from '@mui/icons-material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/CloseOutlined'
import { Box, Button, Card, IconButton, TextField, Tooltip, Typography, css } from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'
import { useCallback, useState, type ChangeEvent } from 'react'

import { useSignalEffect } from '@preact/signals-react'
import { database } from 'database'
import { TaskStatusSelector } from 'sharedComponents'
import { ETaskStatus } from 'types'
import { selectedDateSignal } from '../signals'

export interface TTodoItem {
  taskId: string
}

const TodoItem = ({ taskId }: TTodoItem) => {
  const [showDetails, setShowDetails] = useState(false)
  const [details, setDetails] = useState('') // Undo doesn't work if synced directly to DB. Might be a more elegant solution, but for now, this works.
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [tempTitle, setTempTitle] = useState('')
  const [status, setStatus] = useState(ETaskStatus.NEW)

  useSignalEffect(() => {
    void database.tasks.where('id').equals(taskId).first().then((task) => {
      setTempTitle(task?.title ?? '')
      setStatus(task?.status ?? ETaskStatus.NEW)
      setDetails(task?.details ?? '')
      setShowDetails(!!task?.details)
    })
  })

  const toggleShowDetails = useCallback(() => { setShowDetails(prev => !prev) }, [])

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

  return (
    <Card css={wrapperCSS}>
      <Box css={headerCSS(showDetails)}>
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
                : <>
                  <Button onClick={handleEdit} css={textEditButtonCSS}>
                    <Typography css={headerTextCSS} variant="h2">{tempTitle}</Typography>
                  </Button>
                </>
            }
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
