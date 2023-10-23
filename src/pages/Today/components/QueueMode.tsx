import { useCallback, useContext, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid4 } from 'uuid'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Box, Button, ButtonGroup, Stack, ToggleButton, Tooltip, Typography, css } from '@mui/material'
import { ChevronRight } from '@mui/icons-material'
import _ from 'lodash'
import moment from 'moment'

import database from 'database'
import { DATE_ISO_DATE_MOMENT_STRING, ETaskStatus, type TProject, type TTask, type TTodoListItem } from 'types'
import { context } from 'Context'
import TodoListItem, { TODO_LIST_ITEM_MARGIN, type Entry } from './TodoListItem'
import { ModalID } from 'modals'
import { TASK_STATUS_IS_ACTIVE, formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import { pageCSS } from 'theme'
import { HEADER_HEIGHT } from '../../../components/Header'

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const MENU_ITEMS_HEIGHT = 36

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
        previousDay.map(async ({ taskId }, index) => {
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
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.SELECT_TASKS_MODAL } })
  }, [dispatch])

  const showAddNewTaskModal = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_TASK_MODAL } })
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
  const [selectedDateActiveEntries, setSelectedDateActiveEntries] = useState<Entry[]>([])
  const [selectedDateInactiveEntries, setSelectedDateInactiveEntries] = useState<Entry[]>([])
  const [showArchive, setShowArchive] = useState(false)

  useLiveQuery(
    async () => {
      const todoListItems = await database.todoListItems
        .where('todoListDate')
        .equals(selectedDate)
        .sortBy('sortOrder')

      const entries = await Promise.all(todoListItems.map(async todoListItem => {
        const task = await database.tasks.where('id').equals(todoListItem.id).first() as TTask
        const project = await database.projects.where('id').equals(task.projectId).first() as TProject

        return {
          ...todoListItem,
          taskTitle: task.title,
          taskStatus: task.status,
          projectTitle: project.title,
          taskDetails: task.details
        }
      }))

      const [activeEntries, inactiveEntries] = _.partition(entries, entry => TASK_STATUS_IS_ACTIVE[entry.taskStatus])
      setSelectedDateActiveEntries(activeEntries)
      setSelectedDateInactiveEntries(inactiveEntries)
    },
    [selectedDate]
  )

  const showManagementModal = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.SELECT_TASKS_MODAL } })
  }, [dispatch])

  const showAddNewTaskModal = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_TASK_MODAL } })
  }, [dispatch])

  const setPreviousDate = () => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: { date: formatDateKeyLookup(moment(selectedDate, DATE_ISO_DATE_MOMENT_STRING).subtract(1, 'day')) } })
  }

  const getNextDate = () => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: { date: formatDateKeyLookup(moment(selectedDate, DATE_ISO_DATE_MOMENT_STRING).add(1, 'day')) } })
  }

  const getToday = () => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: { date: formatDateKeyLookup(moment()) } })
  }

  // Laziness for types lol
  const onDragEnd = async (result: any) => {
    // Sorting order gets updated a little weirdly if data goes all the way to Dexie and back.
    // That's why we call set state at the end of this function.
    if (!selectedDateActiveEntries || !result.destination) return

    const source = selectedDateActiveEntries[result.source.index]
    const destination = selectedDateActiveEntries[result.destination.index]
    if (!source || !destination) {
      return
    }
    const reordered = reorder(selectedDateActiveEntries, result.source.index, result.destination.index)
    await Promise.all(reordered.map(({ id }, index) => {
      void database.todoListItems.where('id').equals(id).modify((i: TTodoListItem) => {
        i.sortOrder = index
      })
      return null
    }))

    setSelectedDateActiveEntries(reordered)
  }

  const toggleShowArchive = useCallback(() => { setShowArchive(prev => !prev) }, [])

  if (restoreInProgress) {
    return null
  }

  return (
    <Box css={pageCSS}>
      <Box css={{ display: 'flex', justifyContent: 'space-between', height: `${MENU_ITEMS_HEIGHT}px` }}>
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
        <ButtonGroup>
          <Button variant='contained' onClick={setPreviousDate}>&lt;</Button>
          <Button variant='contained' css={todayButtonCSS} onClick={getToday}><span>{formatDateDisplayString(selectedDate)}</span></Button>
          <Button variant='contained' onClick={getNextDate}>&gt;</Button>
        </ButtonGroup>
      </Box>
      <Box css={todolistItemsWrapperCSS}>
        {selectedDateActiveEntries.length === 0 && selectedDateInactiveEntries.length === 0 && <EmptyTodoList />}
        {selectedDateActiveEntries.length > 0 && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={dragAndDropCSS()}
                >
                  {selectedDateActiveEntries.map((it, index) => (
                    <Draggable
                      key={it.id}
                      draggableId={it.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={dragItemCSS(snapshot.isDraggingOver, provided.draggableProps.style)}
                        >
                          <TodoListItem {...it}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))
                  }
                  {provided.placeholder}
                </div >
              )}
            </Droppable >
          </DragDropContext >
        )}
        {(selectedDateInactiveEntries.length > 0) && (
          <>
            <Stack direction="row" css={css`margin-bottom: 0.5rem;`}>
              <Typography variant="h2">Archive</Typography>
              <ToggleButton
                size='small'
                value="text"
                onChange={toggleShowArchive}
                css={{ marginLeft: '0.5rem' }}
              >
                <Tooltip title="Show archive" >
                  <ChevronRight fontSize="small" css={{ transform: `rotate(${showArchive ? '90deg' : '0deg'})` }} />
                </Tooltip>
              </ToggleButton>
            </Stack>
            {showArchive && selectedDateInactiveEntries.map((it) => <TodoListItem key={it.id} {...it} />)}
          </>
        )}
      </Box >
    </Box >
  )
}

const todolistItemsWrapperCSS = css`
  overflow: auto;
  height: calc(100vh - ${MENU_ITEMS_HEIGHT}px - ${HEADER_HEIGHT}px);
`

const dragAndDropCSS = () => {
  return ({
    margin: '0 0 1rem 0'
  })
}

const dragItemCSS = (_isDragging: boolean, draggableStyle: any) => ({
  margin: TODO_LIST_ITEM_MARGIN,
  cursor: 'pointer',

  // styles we need to apply on draggables
  ...draggableStyle
})

const todayButtonCSS = css`
  width: 220px;
      &:hover span {
        display: none;
  }

      :hover:before {
        content:"Go to Today";
  }
      `

const emptyTodoListCSS = css`
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100%;
      `

export default TodoList