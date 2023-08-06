import React, { useCallback, useContext } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid4 } from 'uuid'
import { Box, Button, ButtonGroup, Typography } from '@mui/material'

import database from 'database'
import { ETaskStatus, type TProject, type TTask } from 'sharedTypes'
import { ModalID } from 'modals'
import { context } from 'Context'
import TodoListItem from './TodoListItem'
import { EmptyStateDisplay } from 'sharedComponents'

const TodoList = () => {
  const { state, dispatch } = useContext(context)

  const selectedDateTodoListItems = useLiveQuery(
    async () => {
      const items = await database.todoListItems.where('todoListDate').equals(state.selectedDate).toArray()

      return await Promise.all(items.map(async ({ id, projectId, taskId, details }) => {
        const task = await database.tasks.where('id').equals(taskId).first() as TTask
        const project = await database.projects.where('id').equals(projectId).first() as TProject

        return {
          taskTitle: task?.title,
          projectTitle: project?.title,
          taskStatus: task?.status,
          details,
          taskId,
          projectId,
          id
        }
      }))
    }, [state.selectedDate]
  )
  console.log(selectedDateTodoListItems)

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
  console.log(selectedDateTodoListItems)
  if ((!selectedDateTodoListItems || selectedDateTodoListItems.length === 0)) {
    return <EmptyStateDisplay message="Nothing planned for today" />
  }

  return (
    <>
      <Typography variant="h3">Todo List</Typography>
      <Box>
        <Button disabled={selectedDateTodoListItems?.length > 0} onClick={getPreviousDatesTasks}>
          Copy Previous
        </Button>
        <Button onClick={handleManageTasks}
        >
          Manage Tasks
        </Button>
        <ButtonGroup>
          <Button onClick={handleNewProject}>New Project</Button>
          <Button onClick={handleNewTask}>New Task</Button>
        </ButtonGroup>
      </Box>
      {selectedDateTodoListItems
        .map((details) => (
          <TodoListItem
            key={details.id}
            {...details}
          />
        ))
      }
    </>
  )
}

export default TodoList
