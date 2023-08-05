import React, { useCallback, useContext, type MouseEvent, type FC } from 'react'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { Box, Button, Tooltip, Typography } from '@mui/material'

import { EmptyStateDisplay } from 'sharedComponents'
import { ETaskStatus } from 'sharedTypes'

import { ModalID } from 'modals'

import PendingIcon from '@mui/icons-material/Pending'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelIcon from '@mui/icons-material/Cancel'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled'
import PsychologyIcon from '@mui/icons-material/Psychology'
import { context } from 'Context'

const StatusToggle: FC<{ taskId: string, status: ETaskStatus }> = ({ taskId, status }) => {
  const handleOnChange = async (
    event: MouseEvent<HTMLElement>,
    value: ETaskStatus | null
  ) => {
    await database.tasks.where('id').equals(taskId).modify({ status: value })
  }

  return (
    <ToggleButtonGroup
      value={status}
      exclusive
      onChange={handleOnChange}
      aria-label="text alignment"
    >
      <ToggleButton value={ETaskStatus.NEW}>
        <Tooltip title="Pending">
          <PendingIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value={ETaskStatus.IN_PROGRESS}>
        <Tooltip title="In Progress">
          <PsychologyIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value={ETaskStatus.BLOCKED}>
        <Tooltip title="Blocked">
          <PauseCircleFilledIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value={ETaskStatus.COMPLETED}>
        <Tooltip title="Completed">
          <CheckCircleOutlineIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value={ETaskStatus.CANCELED}>
        <Tooltip title="Canceled">
          <CancelIcon />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

interface TodoListItemProps {
  todoListItemId: string
  taskId: string
  projectId: string
}

const TodoListItem = ({ todoListItemId, projectId, taskId }: TodoListItemProps) => {
  const { dispatch } = useContext(context)
  const todoListItem = useLiveQuery(async () => await database.todoListItems.where('id').equals(todoListItemId).first())
  const task = useLiveQuery(async () => await database.tasks.where('id').equals(taskId).first())
  const project = useLiveQuery(async () => await database.projects.where('id').equals(projectId).first())

  const handleEdit = useCallback(() => {
    dispatch({
      type: 'SET_ACTIVE_MODAL',
      payload: {
        id: ModalID.EDIT_TASK,
        data: {
          taskId
        }
      }
    })
  }, [dispatch, taskId])

  if (!todoListItem || !project || !task) {
    return <EmptyStateDisplay message="Could not find that todo list item" />
  }

  return (
    <Box>
      <Typography variant="h4">{task.title} - {project.title}</Typography>
      <StatusToggle taskId={task.id} status={task.status} />
      <li>Details: {todoListItem.details}</li>
      <li>Todo List Date: {todoListItem.todoListDate}</li>
      <Button onClick={handleEdit}>Edit</Button>
    </Box>
  )
}

const TodoListItems = () => {
  const { state } = useContext(context)

  const todoListItems = useLiveQuery(async () => {
    return await database.todoListItems.where('todoListDate').equals(state.selectedDate).toArray()
  })

  if (!todoListItems || todoListItems.length === 0) {
    return (
      <EmptyStateDisplay
        message="Click Add Tasks to get started!"
      />
    )
  }

  return (
    <div>
      {todoListItems
        .map((todoListItem) => (
          <TodoListItem
            key={todoListItem.id}
            todoListItemId={todoListItem.id}
            projectId={todoListItem.projectId}
            taskId={todoListItem.taskId}
          />
        ))
      }
    </div>

  )
}

export default TodoListItems
