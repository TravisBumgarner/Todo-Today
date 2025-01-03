import { Box, Button, ButtonGroup, css } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { Reorder } from 'framer-motion'
import moment from 'moment'
import { useCallback, useState } from 'react'

import { useSignals } from '@preact/signals-react/runtime'
import { database, queries } from 'database'
import { ModalID } from 'modals'
import { DATE_ISO_DATE_MOMENT_STRING, ETaskStatus } from 'types'
import { formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import { activeModalSignal, selectedDateSignal } from '../signals'
import EmptyTodoList from './EmptyTodoList'
import TodoItem from './TodoItem'

const TodoList = () => {
  useSignals()
  const [taskIds, setTaskIds] = useState<string[]>([])

  useLiveQuery(
    async () => {
      setTaskIds(await database.todoList
        .where({ date: selectedDateSignal.value })
        .first()
        .then(async todoList => {
          // Sort tasks by status so anything complete or canceled is at the bottom
          const taskIds = todoList?.taskIds ?? []
          const tasks = await Promise.all(taskIds.map(async id => await database.tasks.get(id)))
          return taskIds.sort((a, b) => {
            const taskA = tasks.find(t => t?.id === a)
            const taskB = tasks.find(t => t?.id === b)
            const statusA = taskA?.status
            const statusB = taskB?.status

            if (statusA === ETaskStatus.CANCELED || statusA === ETaskStatus.COMPLETED) return 1
            if (statusB === ETaskStatus.CANCELED || statusB === ETaskStatus.COMPLETED) return -1
            return 0
          })
        })
      )
    },
    [selectedDateSignal.value]
  )

  const onReorder = useCallback(async (newTaskIds: string[]) => {
    await queries.reorderTasks(selectedDateSignal.value, newTaskIds)
  }, [])

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
    <Box css={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%' }}>
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
      <Box css={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {taskIds.length === 0 && <EmptyTodoList />}
        {taskIds.length > 0 && (
          <Reorder.Group axis="y" values={taskIds} onReorder={onReorder} style={{ padding: 0 }}>
            {taskIds.map((taskId) => (
              <Reorder.Item key={taskId} value={taskId} style={{ listStyle: 'none' }}>
                <TodoItem key={taskId} taskId={taskId} />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </Box>
    </Box>
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
