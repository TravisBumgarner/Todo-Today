import { useCallback, useContext } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid4 } from 'uuid'

import database from 'database'
import { ETaskStatus, type TProject, type TTask } from 'sharedTypes'
import { context } from 'Context'
import TodoListItem from './TodoListItem'
import { Button, Typography } from '@mui/material'
import { ModalID } from 'modals'
import { EmptyStateDisplay } from 'sharedComponents'

const TodoList = () => {
  const { state: { selectedDate }, dispatch } = useContext(context)

  const selectedDateTodoListItems = useLiveQuery(
    async () => {
      const items = await database.todoListItems.where('todoListDate').equals(selectedDate).toArray()

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
    }, [selectedDate]
  )

  const getPreviousDatesTasks = useCallback(async () => {
    const lastDate = (
      await database.todoListItems.where('todoListDate').below(selectedDate).sortBy('todoListDate')
    ).reverse()[0]

    if (lastDate) {
      const previousDay = await database.todoListItems
        .where({
          todoListDate: lastDate.todoListDate
        })
        .toArray()

      if (previousDay.length === 0) {
        alert('nothing to show modal')
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
              todoListDate: selectedDate,
              details
            })
          }
        })
      }
    } else {
      alert('Nothing to copy modal')
    }
  }, [selectedDate])

  const showManagementModal = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.MANAGE_TASKS } })
  }, [dispatch])

  const showAddNewProjectModal = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_PROJECT } })
  }, [dispatch])

  const showAddNewTaskModal = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_TASK } })
  }, [dispatch])

  return (
    <div>
      <Typography variant="h3">Todo List</Typography>
      <Button
        disabled={selectedDateTodoListItems && selectedDateTodoListItems.length > 0}
        onClick={getPreviousDatesTasks}
      >
        Copy Previous
      </Button>
      <Button
        onClick={showManagementModal}
      >
        Select Tasks
      </Button>
      <Button
        onClick={showAddNewProjectModal}
      >
        Add New Project
      </Button>
      <Button
        onClick={showAddNewTaskModal}
      >
        Add New Task
      </Button>
      {selectedDateTodoListItems && selectedDateTodoListItems.length > 0
        ? (
          selectedDateTodoListItems.map((details) => (
            <TodoListItem
              key={details.taskId}
              {...details}
            />
          ))
        )
        : (
          <EmptyStateDisplay message="Go create some projects and tasks and come back!" />
        )}
    </div>
  )
}

export default TodoList
