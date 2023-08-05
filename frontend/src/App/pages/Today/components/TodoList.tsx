import React, { useCallback, useContext } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid4 } from 'uuid'
import { Box, Button, ButtonGroup, Typography } from '@mui/material'

import { EmptyStateDisplay } from 'sharedComponents'
import database from 'database'
import { ETaskStatus } from 'sharedTypes'
import { ModalID } from 'modals'
import { TodoListTable } from '.'
import { context } from 'Context'

const TodoList = () => {
  const { state, dispatch } = useContext(context)
  const projects = useLiveQuery(async () => await database.projects.toArray())
  const tasks = useLiveQuery(async () => await database.tasks.toArray())

  const todoListItems = useLiveQuery(
    async () => await database.todoListItems.where('todoListDate').equals(state.selectedDate).toArray())

  const getPreviousDatesTasks = async () => {
    const lastDate = (
      await database.todoListItems.where('todoListDate').below(state.selectedDate).sortBy('todoListDate')
    ).reverse()[0]

    if (lastDate) {
      const previousDay = await database.todoListItems
        .where({
          todoListDate: lastDate.todoListDate
        })
        .toArray()

      if (previousDay.length === 0) {
        alert('nothing to show')
      } else {
        previousDay.map(async ({ projectId, taskId, details }) => {
          const task = await database.tasks.where('id').equals(taskId).first()

          if (
            task?.status === ETaskStatus.NEW ||
            task?.status === ETaskStatus.IN_PROGRESS ||
            task?.status === ETaskStatus.BLOCKED
          ) {
            await database.todoListItems.add({
              projectId,
              taskId,
              id: uuid4(),
              todoListDate: state.selectedDate,
              details
            })
          }
        })
      }
    } else {
      alert('nothing to show')
    }
  }

  const handleNewProject = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_PROJECT } })
  }, [dispatch])

  const handleNewTask = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_TASK } })
  }, [dispatch])

  const handleManageTasks = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.MANAGE_TASKS } })
  }, [dispatch])

  return (
    <>
      <Typography variant="h3">Todo List</Typography>
      <Box>
        <Button disabled={todoListItems && todoListItems.length > 0} onClick={getPreviousDatesTasks}>
          Copy Previous
        </Button>
        <Button disabled={tasks && tasks.length === 0} onClick={handleManageTasks}
        >
          Manage Tasks
        </Button>
        <ButtonGroup>
          <Button onClick={handleNewProject}>New Project</Button>
          <Button disabled={projects?.length === 0} onClick={handleNewTask}>New Task</Button>
        </ButtonGroup>
      </Box>
      {tasks?.length !== 0
        ? (
          <TodoListTable />
        )
        : (
          <EmptyStateDisplay message="Go create some projects and tasks and come back!" />
        )}
    </>
  )
}

export default TodoList
