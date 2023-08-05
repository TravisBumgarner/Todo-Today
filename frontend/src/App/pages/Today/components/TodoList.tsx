import React, { useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid4 } from 'uuid'
import { Button, Typography } from '@mui/material'

import { EmptyStateDisplay, ConfirmationModal } from 'sharedComponents'
import database from 'database'
import { ETaskStatus } from 'sharedTypes'
import { AddTaskModal, AddProjectModal, ModalID } from 'modals'
import { TodoListTable, ManageTodoListItemsModal } from '.'
import { context } from 'Context'

const TodoList = () => {
  const { state, dispatch } = React.useContext(context)
  const [showManagementModal, setShowManagementModal] = React.useState<boolean>(false)
  const [showNothingToCopyModal, setShowNothingToCopyModal] = React.useState<boolean>(false)

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
        setShowNothingToCopyModal(true)
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
      setShowNothingToCopyModal(true)
    }
  }

  const handleNewProject = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_PROJECT } })
  }, [dispatch])

  const handleNewTask = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_TASK } })
  }, [dispatch])

  return (
    <>
      <Typography variant="h3">Todo List</Typography>
      <Button disabled={todoListItems && todoListItems.length > 0} onClick={getPreviousDatesTasks}>
        Copy Previous
      </Button>
      <Button disabled={tasks && tasks.length === 0} onClick={() => { setShowManagementModal(true) }}
      >
        Select Tasks
      </Button>
      <Button onClick={handleNewProject}>New Project</Button>
      <Button disabled={projects?.length === 0} onClick={handleNewTask}>New Task</Button>
      {tasks?.length !== 0
        ? (
          <TodoListTable />
        )
        : (
          <EmptyStateDisplay message="Go create some projects and tasks and come back!" />
        )}
      {/* <ConfirmationModal
        body="It looks like there's nothing to copy from yesterday."
        title="Heads Up!"
        confirmationCallback={() => { setShowNothingToCopyModal(false) }}
        showModal={showNothingToCopyModal}
        setShowModal={setShowNothingToCopyModal}
      /> */}
    </>
  )
}

export default TodoList
