import React, { useCallback, useContext, type MouseEvent, type FC, useState } from 'react'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { Box, Button, TextField, Tooltip, Typography, css } from '@mui/material'

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
  const handleStatusChange = async (
    event: MouseEvent<HTMLElement>,
    value: ETaskStatus | null
  ) => {
    await database.tasks.where('id').equals(taskId).modify({ status: value })
  }

  return (
    <ToggleButtonGroup
      value={status}
      exclusive
      onChange={handleStatusChange}
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
  taskTitle: string
  projectTitle: string
  taskStatus: ETaskStatus
  details: string
  taskId: string
  projectId: string
  id: string
}

const TodoListItem = ({ taskId, taskStatus, details, taskTitle, id, projectTitle }: TodoListItemProps) => {
  const { dispatch } = useContext(context)

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

  const handleDetailsChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    async (event) => {
      await database.todoListItems.where('id').equals(id).modify({ details: event.target.value })
    },
    [id]
  )

  // if (!todoListItem || !project || !task) {
  //   return <EmptyStateDisplay message="Could not find that todo list item" />
  // }

  return (
    <Box>
      <Typography variant="h4">{taskTitle} - {projectTitle}</Typography>
      <StatusToggle taskId={taskId} status={taskStatus} />
      <TextField onChange={handleDetailsChange} value={details} />
      <Button onClick={handleEdit}>Edit</Button>
    </Box>
  )
}

export default TodoListItem
