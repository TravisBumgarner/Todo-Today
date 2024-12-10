import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { ChevronRight } from '@mui/icons-material'
import { Box, Button, ButtonGroup, Stack, ToggleButton, Tooltip, Typography, css } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import _ from 'lodash'
import moment from 'moment'
import { useCallback, useContext, useState } from 'react'
import { v4 as uuid4 } from 'uuid'

import { useSignals } from '@preact/signals-react/runtime'
import { context } from 'Context'
import database from 'database'
import { ModalID } from 'modals'
import { globalContentWrapperCSS } from 'theme'
import { DATE_ISO_DATE_MOMENT_STRING, ETaskStatus, type TTask, type TTodoListItem } from 'types'
import { TASK_STATUS_IS_ACTIVE, formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import { activeModalSignal, selectedDateSignal } from '../signals'
import QueueItem, { type QueueItemEntry } from './QueueItem'

export const emptyTodoListCSS = css`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;

    > div {
      height: 80px;
      width: 800px;
      text-align: center;
    }
`

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const EmptyTodoList = () => {
  useSignals()
  const getPreviousDatesTasks = useCallback(async () => {
    const lastEntry = (await database.todoListItems.toArray()).filter(entry => entry.todoListDate < selectedDateSignal.value).reverse()[0]

    if (lastEntry) {
      const previousDay = await database.todoListItems
        .where({
          todoListDate: lastEntry.todoListDate
        })
        .toArray()

      if (previousDay.length === 0) {
        activeModalSignal.value = {
          id: ModalID.CONFIRMATION_MODAL,
          title: 'Something went Wrong',
          body: 'There is nothing to copy from the previous day'
        }
      } else {
        void previousDay.map(async ({ taskId }, index) => {
          const task = await database.tasks.where('id').equals(taskId).first()

          if (
            task?.status === ETaskStatus.NEW ||
            task?.status === ETaskStatus.IN_PROGRESS ||
            task?.status === ETaskStatus.BLOCKED
          ) {
            await database.todoListItems.add({
              taskId,
              id: uuid4(),
              todoListDate: selectedDateSignal.value,
              sortOrder: index
            })
          }
        })
      }
    } else {
      activeModalSignal.value = {
        id: ModalID.CONFIRMATION_MODAL,
        title: 'Something went Wrong',
        body: 'There is nothing to copy from the previous day'
      }
    }
  }, [])

  const showManagementModal = useCallback(() => {
    activeModalSignal.value = { id: ModalID.SELECT_TASKS_MODAL }
  }, [])

  const showAddNewTaskModal = useCallback(() => {
    activeModalSignal.value = { id: ModalID.ADD_TASK_MODAL }
  }, [])

  return (
    <Box css={emptyTodoListCSS}>
      <Box>
        <Typography css={{ marginBottom: '1rem' }} variant='h2'>What will you do today?</Typography>
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
    </Box>
  )
}

const TodoList = () => {
  useSignals()
  const { state: { restoreInProgress } } = useContext(context)
  const [selectedDateActiveEntries, setSelectedDateActiveEntries] = useState<QueueItemEntry[]>([])
  const [selectedDateInactiveEntries, setSelectedDateInactiveEntries] = useState<QueueItemEntry[]>([])
  const [showArchive, setShowArchive] = useState(false)

  useLiveQuery(
    async () => {
      const todoListItems = await database.todoListItems
        .where({ todoListDate: selectedDateSignal.value })
        .toArray()

      const entries = await Promise.all(todoListItems.map(async todoListItem => {
        const task = await database.tasks.where('id').equals(todoListItem.taskId).first() as TTask

        return {
          ...todoListItem,
          taskTitle: task.title,
          taskStatus: task.status,
          taskDetails: task.details
        }
      }))

      const [activeEntries, inactiveEntries] = _.partition(entries, entry => TASK_STATUS_IS_ACTIVE[entry.taskStatus])
      setSelectedDateActiveEntries(activeEntries)
      setSelectedDateInactiveEntries(inactiveEntries)
    },
    [selectedDateSignal.value]
  )

  const showManagementModal = useCallback(() => {
    activeModalSignal.value = { id: ModalID.SELECT_TASKS_MODAL }
  }, [])

  const showAddNewTaskModal = useCallback(() => {
    activeModalSignal.value = { id: ModalID.ADD_TASK_MODAL }
  }, [])

  const setPreviousDate = useCallback(() => {
    selectedDateSignal.value = formatDateKeyLookup(moment(selectedDateSignal.value, DATE_ISO_DATE_MOMENT_STRING).subtract(1, 'day'))
  }, [])

  const getNextDate = useCallback(() => {
    selectedDateSignal.value = formatDateKeyLookup(moment(selectedDateSignal.value, DATE_ISO_DATE_MOMENT_STRING).add(1, 'day'))
  }, [])

  const getToday = useCallback(() => {
    selectedDateSignal.value = formatDateKeyLookup(moment())
  }, [])

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
    <>
      <Box css={buttonWrapperCSS}>
        <Box>
          <ButtonGroup>
            <Button
              variant='contained'
              onClick={showAddNewTaskModal}
            >
              Add New Task
            </Button>
            <Button
              onClick={showManagementModal}
              variant='contained'
            >
              Select Tasks
            </Button>
          </ButtonGroup>
        </Box>
        <Box>
          <ButtonGroup>
            <Button variant='contained' onClick={setPreviousDate}>&lt;</Button>
            <Button variant='contained' css={todayButtonCSS} onClick={getToday}><span>{formatDateDisplayString(selectedDateSignal.value)}</span></Button>
            <Button variant='contained' onClick={getNextDate}>&gt;</Button>
          </ButtonGroup>
        </Box>
      </Box>

      <Box css={globalContentWrapperCSS}>
        {selectedDateActiveEntries.length === 0 && selectedDateInactiveEntries.length === 0 && <EmptyTodoList />}
        {selectedDateActiveEntries.length > 0 && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
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
                          <QueueItem {...it}
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
            {showArchive && selectedDateInactiveEntries.map((it) => <QueueItem key={it.id} {...it} />)}
          </>
        )}
      </Box >
    </ >
  )
}

export const buttonWrapperCSS = css`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`

const dragItemCSS = (_isDragging: boolean, draggableStyle: any) => ({
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

export default TodoList
