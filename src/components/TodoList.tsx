import { Box, Button, ButtonGroup, Typography, css } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import moment from 'moment'
import { useCallback, useState } from 'react'
import { v4 as uuid4 } from 'uuid'

import { useSignals } from '@preact/signals-react/runtime'
import database from 'database'
import { ModalID } from 'modals'
import { DATE_ISO_DATE_MOMENT_STRING, ETaskStatus, type TTask } from 'types'
import { formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import { activeModalSignal, selectedDateSignal } from '../signals'
import QueueItem, { type QueueItemEntry } from './TodoItem'

export const emptyTodoListCSS = css`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    > div {
      height: 80px;
      text-align: center;
    }
`

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
        void previousDay.map(async ({ taskId }) => {
          const task = await database.tasks.where('id').equals(taskId).first()

          if (
            task?.status === ETaskStatus.NEW ||
            task?.status === ETaskStatus.IN_PROGRESS ||
            task?.status === ETaskStatus.BLOCKED
          ) {
            await database.todoListItems.add({
              taskId,
              id: uuid4(),
              todoListDate: selectedDateSignal.value
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
  const [entries, setEntries] = useState<QueueItemEntry[]>([])

  useLiveQuery(
    async () => {
      const todoListItems = await database.todoListItems
        .where({ todoListDate: selectedDateSignal.value })
        .toArray()

      const newEntries = await Promise.all(todoListItems.map(async todoListItem => {
        const task = await database.tasks.where('id').equals(todoListItem.taskId).first() as TTask

        return {
          ...todoListItem,
          taskTitle: task.title,
          taskStatus: task.status,
          taskDetails: task.details
        }
      }))

      setEntries(newEntries)
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

      {entries.length === 0 && <EmptyTodoList />}
      {entries.length > 0 && (
        entries.map((it) => (
          <QueueItem key={it.id} {...it} />
        )))
      }
    </ >
  )
}

export const buttonWrapperCSS = css`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`

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
