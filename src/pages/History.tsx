import { useLiveQuery } from 'dexie-react-hooks'
import { useState, useCallback, useMemo, useContext, useEffect } from 'react'
import { Box, Card, IconButton, ToggleButton, Tooltip, Typography, css } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { ChevronRight } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'

import { EmptyStateDisplay } from 'sharedComponents'
import database from 'database'
import { pageCSS } from 'theme'
import { type TProject, type TTask } from 'types'
import { context } from 'Context'
import { ModalID } from 'modals'
import { projectStatusLookup } from 'utilities'

interface TaskProps {
  task: TTask & { lastTodoListDate: string }
}

const Task = ({ task }: TaskProps) => {
  const { dispatch } = useContext(context)

  const handleEditTask = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.EDIT_TASK_MODAL, taskId: task.id } })
  }, [dispatch, task.id])

  const handleDeleteTask = useCallback(() => {
    dispatch({
      type: 'SET_ACTIVE_MODAL',
      payload: {
        id: ModalID.CONFIRMATION_MODAL,
        title: `Delete ${task.title}?`,
        body: 'This will remove the task',
        confirmationCallback: async () => { await deleteTask(task.id) }
      }
    })
  }, [dispatch, task.title, task.id])

  return (
    <Box css={tasksHeaderCSS}>
      <Typography variant="body1">{task.lastTodoListDate} - {task.title}</Typography>
      <Box css={rightHeaderCSS}>
        <IconButton onClick={handleEditTask}>
          <EditIcon fontSize="small" />
        </IconButton>

        <IconButton onClick={handleDeleteTask} css={{ marginLeft: '0.5rem' }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  )
}

interface ProjectProps {
  project: TProject
}

const deleteProject = async (projectId: string) => {
  await database.projects.where('id').equals(projectId).delete()
  await database.tasks.where('projectId').equals(projectId).delete()
}

const deleteTask = async (taskId: string) => {
  await database.tasks.where('id').equals(taskId).delete()
}

const Project = ({ project }: ProjectProps) => {
  const { dispatch } = useContext(context)
  const [showTasks, setShowTasks] = useState(false)
  const toggleShowTasks = useCallback(() => { setShowTasks(prev => !prev) }, [])
  const [tasksWithLastActiveDate, setTasksWithLastActiveDate] = useState<Array<TTask & { lastTodoListDate: string }>>([])

  useLiveQuery(async () => {
    const tasks = await database.tasks.where({ projectId: project.id }).toArray()

    const taskIdToLastDate: Record<string, string> = {}

    for (const task of tasks) {
      const lastItem = await database.todoListItems
        .where('taskId')
        .equals(task.id)
        .reverse()
        .first()

      if (lastItem) {
        taskIdToLastDate[task.id] = lastItem.todoListDate
      } else {
        taskIdToLastDate[task.id] = ''
      }
    }

    // Combine the tasks with the last todoListDate
    const tasksWithLastDate = tasks.map(task => ({
      ...task,
      lastTodoListDate: taskIdToLastDate[task.id]
    }))

    setTasksWithLastActiveDate(tasksWithLastDate)
  }, [project.id])

  const handleEditProject = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.EDIT_PROJECT_MODAL, projectId: project.id } })
  }, [dispatch, project.id])

  const handleDeleteProject = useCallback(() => {
    dispatch({
      type: 'SET_ACTIVE_MODAL',
      payload: {
        id: ModalID.CONFIRMATION_MODAL,
        title: `Delete ${project.title}?`,
        body: 'This will remove the project and all associated tasks',
        confirmationCallback: async () => { await deleteProject(project.id) }
      }
    })
  }, [dispatch, project.title, project.id])

  const content = useMemo(() => {
    if (!showTasks) {
      return null
    }

    if (!tasksWithLastActiveDate || tasksWithLastActiveDate.length === 0) {
      return <EmptyStateDisplay message="No tasks" />
    }

    return tasksWithLastActiveDate.sort((a, b) => a.lastTodoListDate < b.lastTodoListDate ? 1 : -1).map(task => <Task key={task.id} task={task} />)
  }, [tasksWithLastActiveDate, showTasks])

  useEffect(() => {
    if (tasksWithLastActiveDate && tasksWithLastActiveDate.length === 0) {
      setShowTasks(false)
    }
  }, [tasksWithLastActiveDate, toggleShowTasks])

  return (
    <Card css={projectWrapperCSS}>
      <Box css={projectHeaderCSS(showTasks)}>
        <Box>
          <Typography variant="h2">{project.title}</Typography>
          <Typography variant="body1">Status: {projectStatusLookup[project.status]}</Typography>
        </Box>
        <Box css={rightHeaderCSS}>
          <ToggleButton
            size='small'
            value="text"
            onChange={toggleShowTasks}
            disabled={!tasksWithLastActiveDate || tasksWithLastActiveDate.length === 0}
            css={{ marginRight: '1rem' }}
          >
            <Tooltip title="Toggle Tasks">
              <ChevronRight fontSize="small" css={{ transform: `rotate(${showTasks ? '90deg' : '0deg'})` }} />
            </Tooltip>
          </ToggleButton>

          <IconButton onClick={handleEditProject}>
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton onClick={handleDeleteProject} css={{ marginLeft: '0.5rem' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>

        </Box>
      </Box>
      {content}
    </Card>
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

const projectWrapperCSS = css`
      background-color: var(--mui-palette-background-paper);
      color: var(--mui-palette-secondary-main);
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      margin: 0 0 1rem 0;
      `

const History = () => {
  const [projects, setProjects] = useState<TProject[] | undefined>(undefined)

  useLiveQuery(async () => {
    const projects = await database.projects.toCollection().sortBy('title')
    setProjects(projects)
  })

  const content = useMemo(() => {
    if (!projects) {
      // Don't flicker screen while projects load.
      return null
    }

    if (projects.length === 0) {
      return <EmptyStateDisplay message="There is no history to show" />
    }

    return projects.map(project => <Project key={project.id} project={project} />)
  }, [projects])

  return (
    <Box css={pageCSS}>
      <Box css={scrollWrapperCSS}>
        {content}
      </Box>
    </Box>
  )
}

const scrollWrapperCSS = css`
      height: 90%;
      overflow: auto;
      margin: 1rem 0 3rem 0;
      `

export default History
