import { useLiveQuery } from 'dexie-react-hooks'
import { useState, useCallback, useMemo, useContext } from 'react'
import { Box, Card, IconButton, ToggleButton, Tooltip, Typography, css } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { ChevronRight } from '@mui/icons-material'

import { EmptyStateDisplay } from 'sharedComponents'
import database from 'database'
import { pageCSS } from 'theme'
import { type TProject, type TTask } from 'sharedTypes'
import { context } from 'Context'
import { ModalID } from 'modals'
import { projectStatusLookup } from 'utilities'

interface TaskProps {
  task: TTask
}

const Task = ({ task }: TaskProps) => {
  const { dispatch } = useContext(context)

  const handleEditTask = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.EDIT_TASK, data: { taskId: task.id } } })
  }, [dispatch, task.id])

  return (
    <Box css={tasksHeaderCSS}>
      <Typography variant="body1">{task.title}</Typography>
      <Box css={rightHeaderCSS}>
        <IconButton onClick={handleEditTask}>
          <EditIcon fontSize="small" />
        </IconButton>

      </Box>
    </Box>
  )
}

interface ProjectProps {
  project: TProject
}

const Project = ({ project }: ProjectProps) => {
  const { dispatch } = useContext(context)
  const [showTasks, setShowTasks] = useState(false)
  const toggleShowTasks = useCallback(() => { setShowTasks(prev => !prev) }, [])
  const tasks = useLiveQuery(async () => await database.tasks.where({ projectId: project.id }).toArray())

  const handleEditProject = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.EDIT_PROJECT, data: { projectId: project.id } } })
  }, [dispatch, project.id])

  const content = useMemo(() => {
    if (!showTasks) {
      return null
    }

    if (!tasks || tasks.length === 0) {
      return <EmptyStateDisplay message="No tasks" />
    }

    return tasks.map(task => <Task key={task.id} task={task} />)
  }, [tasks, showTasks])

  return (
    <Card css={wrapperCSS}>
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
            disabled={!tasks || tasks.length === 0}
            css={{ marginRight: '1rem' }}
          >
            <Tooltip title="Toggle Tasks">
              <ChevronRight fontSize="small" css={{ transform: `rotate(${showTasks ? '90deg' : '0deg'})` }} />
            </Tooltip>
          </ToggleButton>

          <IconButton onClick={handleEditProject}>
            <EditIcon fontSize="small" />
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

const wrapperCSS = css`
  background-color: var(--mui-palette-background-paper);
  color: var(--mui-palette-secondary-main);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin: 0 0 1rem 0;
`

const History = () => {
  const projects = useLiveQuery(async () => await database.projects.toCollection().sortBy('title'))

  const content = useMemo(() => {
    if (!projects || projects.length === 0) {
      return <EmptyStateDisplay message="No projects" />
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
    margin-top: 1rem;
`

export default History
