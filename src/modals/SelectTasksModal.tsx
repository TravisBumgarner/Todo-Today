import { useCallback, useContext, useMemo, useState } from 'react'
import { v4 as uuid4 } from 'uuid'
import { useLiveQuery } from 'dexie-react-hooks'
import { Box, Button, IconButton, ToggleButton, Tooltip, Typography, css } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { ChevronRight } from '@mui/icons-material'

import Modal, { MODAL_MAX_HEIGHT } from './Modal'
import { EmptyStateDisplay } from 'sharedComponents'
import { type TProject, EProjectStatus, type TTask, ETaskStatus } from 'types'
import database from 'database'
import { context } from 'Context'
import { ModalID } from './LazyLoadModal'

interface TaskProps {
  task: TTask
  isSelected: boolean
}

const Task = ({ task, isSelected }: TaskProps) => {
  const { state } = useContext(context)

  const handleSelect = async () => {
    await database.todoListItems.add({
      taskId: task.id,
      id: uuid4(),
      todoListDate: state.selectedDate,
      sortOrder: -1
    })
  }

  const handleDeselect = async () => {
    await database.todoListItems
      .where('taskId').equals(task.id)
      .and(item => item.todoListDate === state.selectedDate)
      .delete()
  }

  return (
    <Box css={tasksHeaderCSS}>
      <Typography variant="body1">{task.title}</Typography>
      <Box css={rightHeaderCSS}>
        <IconButton color={isSelected ? 'secondary' : 'default'} onClick={isSelected ? handleDeselect : handleSelect}>
          <CheckIcon fontSize="small" />
        </IconButton>

      </Box>
    </Box >
  )
}

interface ProjectProps {
  project: TProject
  selectedTaskIds: string[]
}

const Project = ({ project, selectedTaskIds }: ProjectProps) => {
  const [showTasks, setShowTasks] = useState(true)
  const toggleShowTasks = useCallback(() => { setShowTasks(prev => !prev) }, [])
  const tasks = useLiveQuery(async () => await database.tasks
    .where({ projectId: project.id })
    .and((item) => [
      ETaskStatus.NEW,
      ETaskStatus.IN_PROGRESS,
      ETaskStatus.BLOCKED
    ].includes(item.status))
    .toArray())

  const content = useMemo(() => {
    if (!showTasks) {
      return null
    }

    return (tasks ?? []).map(task => <Task isSelected={selectedTaskIds.includes(task.id)} key={task.id} task={task} />)
  }, [tasks, showTasks, selectedTaskIds])

  if (!tasks || tasks.length === 0) {
    return null
  }

  return (
    <Box css={wrapperCSS}>
      <Box css={projectHeaderCSS(showTasks)}>
        <Typography variant="h2">{project.title}</Typography>
        <Box css={rightHeaderCSS}>
          <ToggleButton
            size='small'
            value="text"
            onChange={toggleShowTasks}
          >
            <Tooltip title="Show Tasks">
              <ChevronRight fontSize="small" css={{ transform: `rotate(${showTasks ? '90deg' : '0deg'})` }} />
            </Tooltip>
          </ToggleButton>
        </Box>
      </Box>
      {content}
    </Box>
  )
}

const rightHeaderCSS = css`
  margin-left: 1rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const projectHeaderCSS = (showDetails: boolean) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${showDetails ? '0.5rem' : 0};
`

const tasksHeaderCSS = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const wrapperCSS = css`
  background-color: var(--mui-palette-background-paper);
  color: var(--mui-palette-secondary-main);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin: 0.5rem 0;
`

const ManageTodoListItemsModal = () => {
  const { state, dispatch } = useContext(context)
  const projects = useLiveQuery(async () => await database.projects.where('status').anyOf(EProjectStatus.ACTIVE).toArray())
  const tasks = useLiveQuery(async () => await database.tasks.where('status').anyOf(ETaskStatus.BLOCKED, ETaskStatus.NEW, ETaskStatus.IN_PROGRESS).toArray())

  const todoListItems = useLiveQuery(async () => await database.todoListItems.where({ todoListDate: state.selectedDate }).toArray(), [state.selectedDate])
  const selectedTaskIds = todoListItems?.map(({ taskId }) => taskId)

  const showAddNewTaskModal = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_TASK_MODAL } })
  }, [dispatch])

  const content = useMemo(() => {
    if (!projects || projects.length === 0 || !tasks || tasks.length === 0) {
      return <EmptyStateDisplay message="There are no Tasks to Work On" callToActionButton={<Button
        onClick={showAddNewTaskModal}
        fullWidth
        variant='contained'
      >
        Add New Task
      </Button>} />
    }

    return (
      <Box css={projectsWrapperCSS}>
        <Box css={scrollWrapperCSS}>
          {
            projects
              .map(project => (
                <Project
                  key={project.id}
                  project={project}
                  selectedTaskIds={selectedTaskIds ?? []}
                />
              ))
          }
        </Box>
      </Box>
    )
  }, [projects, selectedTaskIds, tasks, showAddNewTaskModal])

  return (
    <Modal
      title='Select Tasks'
      showModal={true}
    >
      {content}
    </Modal>
  )
}

const scrollWrapperCSS = css`
  overflow: auto;
  max-height: ${MODAL_MAX_HEIGHT - 200}px;
`

const projectsWrapperCSS = css`
  height: 100%;
`

export default ManageTodoListItemsModal
