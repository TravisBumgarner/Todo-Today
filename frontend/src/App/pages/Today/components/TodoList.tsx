import { useCallback, useContext, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid4 } from 'uuid'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import database from 'database'
import { ETaskStatus, type TProject, type TTask, type TTodoListItem } from 'sharedTypes'
import { context } from 'Context'
import TodoListItem from './TodoListItem'
import { Box, Button, ButtonGroup, css } from '@mui/material'
import { ModalID } from 'modals'
import { EmptyStateDisplay } from 'sharedComponents'
import { formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import moment from 'moment'

const TodoList = () => {
  const { state: { selectedDate }, dispatch } = useContext(context)
  const [toggleSortOrder, setToggleSortOrder] = useState(false)

  const selectedDateTodoListItems = useLiveQuery(
    async () => {
      const items = await database.todoListItems.where('todoListDate').equals(selectedDate).sortBy('sortOrder')

      return await Promise.all(items.map(async ({ id, projectId, taskId, details, sortOrder }) => {
        const task = await database.tasks.where('id').equals(taskId).first() as TTask
        const project = await database.projects.where('id').equals(projectId).first() as TProject

        return {
          taskTitle: task?.title,
          projectTitle: project?.title,
          taskStatus: task?.status,
          details,
          taskId,
          projectId,
          id,
          sortOrder
        }
      }))
    }, [selectedDate, toggleSortOrder]
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
        previousDay.map(async ({ projectId, taskId, details }, index) => {
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
              details,
              sortOrder: index
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

  // Laziness for types lol
  const onDragEnd = async (result: any) => {
    if (!selectedDateTodoListItems) return

    const source = selectedDateTodoListItems[result.source.index]
    const destination = selectedDateTodoListItems[result.destination.index]

    if (!source || !destination) {
      return
    }

    await database.todoListItems.where('id').equals(source.id).modify((i: TTodoListItem) => {
      i.sortOrder = result.destination.index
    })
    await database.todoListItems.where('id').equals(destination.id).modify((i: TTodoListItem) => {
      i.sortOrder = result.source.index
    })

    setToggleSortOrder(prev => !prev)
  }
  console.log(selectedDateTodoListItems)
  if (!selectedDateTodoListItems) {
    return (
      <EmptyStateDisplay message="Go create some projects and tasks and come back!" />
    )
  }

  return (
    <Box>
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
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={dragAndDropCSS}
            >
              {selectedDateTodoListItems.map((it) => (
                <Draggable
                  key={it.id}
                  draggableId={it.id}
                  index={it.sortOrder}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TodoListItem {...it}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  )
}

const dragAndDropCSS = {
  border: '2px solid black',
  borderRadius: '1rem',
  marginTop: '1rem'
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
