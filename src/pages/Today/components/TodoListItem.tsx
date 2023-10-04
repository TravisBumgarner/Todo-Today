import { type ChangeEvent, useState, useCallback, useContext, useMemo } from 'react'
import { Box, Button, Card, Icon, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, TextField, Tooltip, Typography, css } from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/CloseOutlined'
import { ChevronRight } from '@mui/icons-material'
import { useLiveQuery } from 'dexie-react-hooks'

import database from 'database'
import { ETaskStatus, type TProject, type TTodoListItem } from 'types'
import { ModalID } from 'modals'
import { context } from 'Context'
import { EmptyStateDisplay, Icons } from 'sharedComponents'

type TodoListItemProps = TTodoListItem

interface Metadata { taskId: string, projectTitle: string, taskTitle: string, taskStatus: ETaskStatus }

const colorStatus: Record<ETaskStatus, 'secondary' | 'primary' | 'warning' | 'error'> = {
  [ETaskStatus.NEW]: 'secondary',
  [ETaskStatus.IN_PROGRESS]: 'secondary',
  [ETaskStatus.COMPLETED]: 'secondary',
  [ETaskStatus.BLOCKED]: 'warning',
  [ETaskStatus.CANCELED]: 'error'
} as const

const percentLookup: Record<ETaskStatus, number> = {
  [ETaskStatus.NEW]: 33,
  [ETaskStatus.IN_PROGRESS]: 66,
  [ETaskStatus.COMPLETED]: 100,
  [ETaskStatus.BLOCKED]: 33,
  [ETaskStatus.CANCELED]: 33
}

const TodoListItem = ({ id, taskId }: TodoListItemProps) => {
  const { dispatch } = useContext(context)
  const [showDetails, setShowDetails] = useState(false)
  const [metadata, setMetadata] = useState<Metadata>({} as Metadata)
  const [details, setDetails] = useState('') // Undo doesn't work if synced directly to DB. Might be a more elegant solution, but for now, this works.

  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenMenu = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
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
    handleCloseMenu()

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

  const statusIcon = useMemo(() => {
    switch (metadata.taskStatus) {
      case ETaskStatus.CANCELED:
        return (
          <Icons.ThreeThirdsCircle css={iconCSS(colorStatus[ETaskStatus.CANCELED])} />
        )
      case ETaskStatus.BLOCKED:
        return (
          <Icons.ThreeThirdsCircle css={iconCSS(colorStatus[ETaskStatus.BLOCKED])} />
        )
      case ETaskStatus.NEW:
        return (
          <Icons.OneThirdsCircle css={iconCSS(colorStatus[ETaskStatus.NEW])} />
        )
      case ETaskStatus.IN_PROGRESS:
        return (
          <Icons.TwoThirdsCircle css={iconCSS(colorStatus[ETaskStatus.IN_PROGRESS])} />
        )
      case ETaskStatus.COMPLETED:
        return (
          <Icons.ThreeThirdsCircle css={iconCSS(colorStatus[ETaskStatus.COMPLETED])} />
        )
    }
  }, [metadata.taskStatus])

  if (!metadata) {
    return <EmptyStateDisplay message='Unable to find project or task details' />
  }

  return (
    <Card css={gradientWrapperCSS(metadata.taskStatus)}>
      <Box css={wrapperCSS}>
        <Box css={headerCSS(showDetails)}>
          <Box css={leftHeaderCSS}>
            <Box>
              <IconButton
                onClick={handleOpenMenu}
              >
                {statusIcon}
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem onClick={async () => { await handleStatusChange(ETaskStatus.CANCELED) }}>
                  <ListItemIcon>
                    <Icons.ThreeThirdsCircle css={iconCSS(colorStatus[ETaskStatus.CANCELED])} />
                  </ListItemIcon>
                  <ListItemText>Cancel</ListItemText>
                </MenuItem>
                <MenuItem onClick={async (event) => { await handleStatusChange(ETaskStatus.BLOCKED) }}>
                  <ListItemIcon>
                    <Icons.ThreeThirdsCircle css={iconCSS(colorStatus[ETaskStatus.BLOCKED])} />
                  </ListItemIcon>
                  <ListItemText>Blocked</ListItemText>
                </MenuItem>
                <MenuItem onClick={async () => { await handleStatusChange(ETaskStatus.NEW) }}>
                  <ListItemIcon>
                    <Icons.OneThirdsCircle css={iconCSS(colorStatus[ETaskStatus.NEW])} />
                  </ListItemIcon>
                  <ListItemText>New</ListItemText>
                </MenuItem>
                <MenuItem onClick={async () => { await handleStatusChange(ETaskStatus.IN_PROGRESS) }}>
                  <ListItemIcon>
                    <Icons.TwoThirdsCircle css={iconCSS(colorStatus[ETaskStatus.IN_PROGRESS])} />
                  </ListItemIcon>
                  <ListItemText>In Progress</ListItemText>
                </MenuItem>
                <MenuItem onClick={async () => { await handleStatusChange(ETaskStatus.COMPLETED) }}>
                  <ListItemIcon>
                    <Icons.ThreeThirdsCircle css={iconCSS(colorStatus[ETaskStatus.COMPLETED])} />
                  </ListItemIcon>
                  <ListItemText>Completed</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
            <Box css={css`margin-left: 1rem`}>
              <Typography css={headerTextCSS(metadata.taskStatus)} variant="h2">{metadata.taskTitle}</Typography>
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
              <Tooltip title="Show Details" >
                <ChevronRight fontSize="small" css={{ transform: `rotate(${showDetails ? '90deg' : '0deg'})` }} />
              </Tooltip>
            </ToggleButton>

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
background: linear-gradient(90deg, var(--mui-palette-${colorStatus[color]}-main) 0%, var(--mui-palette-background-paper)  ${percentLookup[color]}%);
`

const headerTextCSS = (color: ETaskStatus) => css`
color: var(--mui-palette-${colorStatus[color]}-main);
`

const leftHeaderCSS = css`
  display: flex;
  align-items: center;
`

const iconCSS = (color: string) => css`
  fill: var(--mui-palette-${color}-main)
  `

const wrapperCSS = css`
background: var(--mui-palette-background-paper);
border-radius: 0.5rem;
padding: 0.5rem;
`

export default TodoListItem
