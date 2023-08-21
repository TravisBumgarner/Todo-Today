import { useCallback, useContext } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid4 } from 'uuid'

import database from 'database'
import { ETaskStatus, type TProject, type TTask } from 'sharedTypes'
import { context } from 'Context'
import TodoListItem from './TodoListItem'
import { Box, Button, ButtonGroup, css } from '@mui/material'
import { ModalID } from 'modals'
import { EmptyStateDisplay } from 'sharedComponents'
import { formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import moment from 'moment'

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
  console.log('todo list items are now', selectedDateTodoListItems)

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

  const showAddNewTaskModal = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_TASK } })
  }, [dispatch])

  const setPreviousDate = () => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: { date: formatDateKeyLookup(moment(selectedDate).subtract(1, 'day')) } })
  }

  const getNextDate = () => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: { date: formatDateKeyLookup(moment(selectedDate).add(1, 'day')) } })
  }

  const getToday = () => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: { date: formatDateKeyLookup(moment()) } })
  }

  return (
    <div>
      <Box css={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Button
            disabled={selectedDateTodoListItems && selectedDateTodoListItems.length > 0}
            onClick={getPreviousDatesTasks}
          >
            Copy Previous
          </Button>
          <ButtonGroup>
            <Button
              onClick={showManagementModal}
            >
              Select Tasks
            </Button>
            <Button
              onClick={showAddNewTaskModal}
            >
              Add New Task
            </Button>
          </ButtonGroup>
        </Box>
        <ButtonGroup>
          <Button onClick={setPreviousDate}>&lt;</Button>
          <Button css={todayButtonCSS} onClick={getToday}><span>{formatDateDisplayString(selectedDate)}</span></Button>
          <Button onClick={getNextDate}>&gt;</Button>
        </ButtonGroup>
      </Box>
      {
        selectedDateTodoListItems && selectedDateTodoListItems.length > 0
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
          )
      }
    </div >
  )
}

const todayButtonCSS = css`
  width: 250px;
  &:hover span {
      display: none;
  }

  :hover:before {
    content:"Go to Today";
  }
`

export default TodoList
