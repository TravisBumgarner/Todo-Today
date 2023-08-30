import React, { useCallback, useContext, useMemo, useState } from 'react'
import { v4 as uuid4 } from 'uuid'
import { useLiveQuery } from 'dexie-react-hooks'
import { Box, Button, Card, IconButton, ToggleButton, Tooltip, Typography, css } from '@mui/material'
import NotesIcon from '@mui/icons-material/Notes'
import ShortTextIcon from '@mui/icons-material/ShortText'
import CheckIcon from '@mui/icons-material/Check'

import Modal from './Modal'
import { EmptyStateDisplay } from 'sharedComponents'
import { type TProject, EProjectStatus, type TTask } from 'sharedTypes'
import database from 'database'
import { context } from 'Context'

interface TaskProps {
  task: TTask
  isSelected: boolean
}

const Task = ({ task, isSelected }: TaskProps) => {
  const { state } = useContext(context)

  const handleSelect = async () => {
    const lastTodoListItem = (await database
      .todoListItems
      .where('todoListDate')
      .equals(state.selectedDate)
      .reverse()
      .sortBy('sortOrder'))[0]

    await database.todoListItems.add({
      taskId: task.id,
      id: uuid4(),
      todoListDate: state.selectedDate,
      details: '',
      sortOrder: lastTodoListItem ? lastTodoListItem.sortOrder + 1 : 0
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
        <IconButton color="primary" onClick={isSelected ? handleDeselect : handleSelect}>
          <CheckIcon fontSize="small" />
        </IconButton>

      </Box>
    </Box>
  )
}

interface ProjectProps {
  project: TProject
  selectedTaskIds: string[]
}

const Project = ({ project, selectedTaskIds }: ProjectProps) => {
  const [showTasks, setShowTasks] = useState(true)
  const toggleShowTasks = useCallback(() => { setShowTasks(prev => !prev) }, [])
  const tasks = useLiveQuery(async () => await database.tasks.where({ projectId: project.id }).toArray())

  const content = useMemo(() => {
    if (!showTasks) {
      return null
    }

    return (tasks ?? []).map(task => <Task isSelected={selectedTaskIds.includes(task.id)} key={task.id} task={task} />)
  }, [tasks, showTasks, selectedTaskIds])

  return (
    <Card css={wrapperCSS}>
      <Box css={projectHeaderCSS(showTasks)}>
        <Typography variant="h4">{project.title}</Typography>
        <Box css={rightHeaderCSS}>
          <ToggleButton
            size='small'
            value="text"
            onChange={toggleShowTasks}
          >
            <Tooltip title="Toggle Tasks">
              {tasks && tasks.length > 0 ? <NotesIcon fontSize="small" /> : <ShortTextIcon fontSize="small" />}
            </Tooltip>
          </ToggleButton>
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
  background-color: var(--mui-palette-primary-dark);
  color: var(--mui-palette-secondary-main);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin: 0.5rem 0;
`

const ManageTodoListItemsModal = () => {
  const { state, dispatch } = useContext(context)
  const projects = useLiveQuery(async () => await database.projects.where('status').anyOf(EProjectStatus.ACTIVE).toArray())

  const todoListItems = useLiveQuery(async () => await database.todoListItems.where({ todoListDate: state.selectedDate }).toArray(), [state.selectedDate])
  const selectedTaskIds = todoListItems?.map(({ taskId }) => taskId)

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  const content = useMemo(() => {
    if (!projects || projects.length === 0) {
      return <EmptyStateDisplay message="No projects" />
    }

    return (
      <>
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
        <Button fullWidth variant='contained' key="finished" onClick={handleCancel}>Done!</Button>
      </>
    )
  }, [handleCancel, projects, selectedTaskIds])

  return (
    <Modal
      title='Select Tasks'
      showModal={true}
    >
      {content}
    </Modal>
  )
}

export default ManageTodoListItemsModal
