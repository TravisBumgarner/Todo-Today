import { useCallback, useContext } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid4 } from 'uuid'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import database from 'database'
import { ETaskStatus, type TTodoListItem } from 'sharedTypes'
import { context } from 'Context'
import TodoListItem from './TodoListItem'
import { Box, Button, ButtonGroup, Typography, css } from '@mui/material'
import { ModalID } from 'modals'
import { formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import moment from 'moment'
import { pageCSS } from 'theme'

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const EmptyTodoList = () => {
  const { state: { selectedDate }, dispatch } = useContext(context)

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
        dispatch({
          type: 'SET_ACTIVE_MODAL',
          payload: {
            id: ModalID.CONFIRMATION_MODAL,
            title: 'Something went Wrong',
            body: 'There is nothing to copy from the previous day'
          }
        })
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
      dispatch({
        type: 'SET_ACTIVE_MODAL',
        payload: {
          id: ModalID.CONFIRMATION_MODAL,
          title: 'Something went Wrong',
          body: 'There is nothing to copy from the previous day'
        }
      })
    }
  }, [selectedDate, dispatch])

  const showManagementModal = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.MANAGE_TASKS } })
  }, [dispatch])

  const showAddNewTaskModal = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_TASK } })
  }, [dispatch])

  return (
    <Box css={emptyTodoListCSS}>
      <Typography css={css`margin-bottom: 1rem`} variant='h2'>What will you do today?</Typography>
      <ButtonGroup>
        <Button
          variant='contained'
          onClick={getPreviousDatesTasks}
        >
          Copy Previous Day
        </Button>
        <Button
          variant='contained'
          onClick={showManagementModal}
        >
          Select Tasks
        </Button>
        <Button
          variant='contained'
          onClick={showAddNewTaskModal}
        >
          Add New Task
        </Button>
      </ButtonGroup>
    </Box>
  )
}

const TodoList = () => {
  const { state: { selectedDate, restoreInProgress }, dispatch } = useContext(context)

  const selectedDateTodoListItems = useLiveQuery<TTodoListItem[]>(
    async () => await database.todoListItems.where('todoListDate').equals(selectedDate).sortBy('sortOrder'),
    [selectedDate]
  )

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
    const reordered = reorder(selectedDateTodoListItems, result.source.index, result.destination.index)
    await Promise.all(reordered.map(({ id }, index) => {
      void database.todoListItems.where('id').equals(id).modify((i: TTodoListItem) => {
        i.sortOrder = index
      })
      return null
    }))
  }

  if (restoreInProgress) {
    return null
  }

  return (
    <Box css={pageCSS}>
      <Box css={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <ButtonGroup>
            <Button
              onClick={showManagementModal}
              variant='contained'
            >
              Select Tasks
            </Button>
            <Button
              variant='contained'
              onClick={showAddNewTaskModal}
            >
              Add New Task
            </Button>
          </ButtonGroup>
        </Box>
        <ButtonGroup>
          <Button variant='contained' onClick={setPreviousDate}>&lt;</Button>
          <Button variant='contained' css={todayButtonCSS} onClick={getToday}><span>{formatDateDisplayString(selectedDate)}</span></Button>
          <Button variant='contained' onClick={getNextDate}>&gt;</Button>
        </ButtonGroup>
      </Box>
      {!selectedDateTodoListItems || selectedDateTodoListItems.length === 0
        ? <EmptyTodoList />
        : (
          <Box css={scrollWrapperCSS}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="tasks">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={dragAndDropCSS(snapshot.isDraggingOver)}
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
    </Box>
  )
}

const dragAndDropCSS = (isDraggingOver: boolean) => {
  return ({
    border: isDraggingOver ? '1px solid var(--mui-palette-primary-main)' : '1px transparent',
    borderRadius: '0.5rem',
    overflow: 'auto',
    height: '90%'
  })
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

const emptyTodoListCSS = css`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`

const scrollWrapperCSS = css`
  margin-top: 1rem;
  height: 90%;
  overflow: auto;
`

export default TodoList
