import { useCallback, useContext } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid4 } from 'uuid'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import database from 'database'
import { ETaskStatus, type TTodoListItem } from 'sharedTypes'
import { context } from 'Context'
import TodoListItem from './TodoListItem'
import { Box, Button, ButtonGroup, css } from '@mui/material'
import { ModalID } from 'modals'
import { EmptyStateDisplay } from 'sharedComponents'
import { formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import moment from 'moment'

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const TodoList = () => {
  const { state: { selectedDate }, dispatch } = useContext(context)

  const selectedDateTodoListItems = useLiveQuery<TTodoListItem[]>(
    async () => await database.todoListItems.where('todoListDate').equals(selectedDate).sortBy('sortOrder'),
    [selectedDate]
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
        previousDay.map(async ({ taskId, details }, index) => {
          const task = await database.tasks.where('id').equals(taskId).first()

          if (
            task?.status === ETaskStatus.NEW ||
            task?.status === ETaskStatus.IN_PROGRESS ||
            task?.status === ETaskStatus.BLOCKED
          ) {
            await database.todoListItems.add({
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
    console.log(result)
    if (!selectedDateTodoListItems) return

    const source = selectedDateTodoListItems[result.source.index]
    const destination = selectedDateTodoListItems[result.destination.index]
    console.log(source, destination)
    if (!source || !destination) {
      return
    }
    const reordered = reorder(selectedDateTodoListItems, result.source.index, result.destination.index)
    await Promise.all(reordered.map(({ id }, index) => {
      void database.todoListItems.where('id').equals(id).modify((i: TTodoListItem) => {
        i.sortOrder = index
      })
      return null
    }))
    // setToggleSortOrder(prev => !prev)
  }

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
              {selectedDateTodoListItems.map((it, index) => (
                <Draggable
                  key={it.id}
                  draggableId={it.id}
                  // It's quite a pain, and probably bug prone, to keep sort order sequential.
                  // Therefore, see if using index is sufficient since `selectedDateTodoListItems` is already
                  // sorted by `sortOrder` and `index` is sequential.
                  index={index}
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
