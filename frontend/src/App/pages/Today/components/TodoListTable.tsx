import React from 'react'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { Box, Tooltip, Typography } from '@mui/material'

import { BigBoxOfNothing } from 'sharedComponents'
import { ETaskStatus, type TDateISODate, type TTask } from 'sharedTypes'

import { EditTaskModal } from 'sharedModals'

import PendingIcon from '@mui/icons-material/Pending'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelIcon from '@mui/icons-material/Cancel'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled'
import PsychologyIcon from '@mui/icons-material/Psychology'

const StatusToggle: React.FC<{ taskId: string, status: ETaskStatus }> = ({ taskId, status }) => {
  const handleOnChange = async (
    event: React.MouseEvent<HTMLElement>,
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

interface TodoListTableRowProps {
  todoListItemId: string
  taskId: string
  projectId: string
}

const TodoListTableRow = ({ todoListItemId, projectId, taskId }: TodoListTableRowProps) => {
  const todoListItem = useLiveQuery(async () => await database.todoListItems.where('id').equals(todoListItemId).first())
  const task = useLiveQuery(async () => await database.tasks.where('id').equals(taskId).first())
  const project = useLiveQuery(async () => await database.projects.where('id').equals(projectId).first())

  if (!todoListItem || !project || !task) {
    return <BigBoxOfNothing message="Could not find that todo list item" />
  }

  return (
    <Box>
      <Typography variant="h4">{task.title} - {project.title}</Typography>
      <StatusToggle taskId={task.id} status={task.status} />
      <li>Details: {todoListItem.details}</li>
      <li>Todo List Date: {todoListItem.todoListDate}</li>
    </Box>
  )
}

interface TodoListItemProps {
  selectedDate: TDateISODate
}

const TodoListItems = ({ selectedDate }: TodoListItemProps) => {
  const [selectedTaskId, setSelectedTaskId] = React.useState<TTask['id'] | null>(null)

  const todoListItems = useLiveQuery(async () => {
    return await database.todoListItems.where('todoListDate').equals(selectedDate).toArray()
  }, [selectedDate])

  if (!todoListItems || todoListItems.length === 0) {
    return (
      <BigBoxOfNothing
        message="Click Add Tasks to get started!"
      />
    )
  }

  return (
    <div>
      {
        todoListItems
          .map((todoListItem) => (
            <TodoListTableRow
              key={todoListItem.id}
              todoListItemId={todoListItem.id}
              projectId={todoListItem.projectId}
              taskId={todoListItem.taskId}
            />
          ))
      }
      {
        selectedTaskId
          ? (
            <EditTaskModal
              showModal={selectedTaskId !== null}
              setShowModal={() => { setSelectedTaskId(null) }}
              taskId={selectedTaskId}
            />
          )
          : (null)
      }
    </div>

  )
}

export default TodoListItems
