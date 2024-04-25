import { useCallback, useContext, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Box, Button, ButtonGroup, Typography, css } from '@mui/material'

import DoItem from './DoItem'
import database from 'database'
import { type TProject, type TTask, type TTodoListItem, type ETaskStatus, type TDateISODate } from 'types'
import { context } from 'Context'
import { ModalID } from 'modals'
import { TASK_STATUS_IS_ACTIVE, getNextSortOrderValue } from 'utilities'
import { pageCSS } from 'theme'
import { HEADER_HEIGHT } from '../../../components/Header'
import { emptyTodoListCSS } from './sharedCSS'

const MENU_ITEMS_HEIGHT = 36

const EmptyTodoList = () => {
  return (
    <Box css={emptyTodoListCSS}>
      <Box>
        <Typography variant='h2'>Switch to queue mode to pick tasks</Typography>
      </Box>
    </Box>
  )
}

interface DoModeEntry {
  id: string
  taskId: string
  todoListDate: string
  sortOrder: number
  taskTitle: string
  taskStatus: ETaskStatus
  projectTitle: string
  taskDetails?: string
  selectedDate: TDateISODate
  todoListItemId: string
}

const TodoList = () => {
  const { state: { selectedDate, restoreInProgress, settings: { concurrentTodoListItems } }, dispatch } = useContext(context)
  const [selectedDateActiveEntries, setSelectedDateActiveEntries] = useState<DoModeEntry[]>([])

  useLiveQuery(
    async () => {
      const todoListItems = await database.todoListItems
        .where('todoListDate')
        .equals(selectedDate)
        .sortBy('sortOrder')

      const entries = await Promise.all(todoListItems.map(async todoListItem => {
        const task = await database.tasks.where('id').equals(todoListItem.taskId).first() as TTask
        const project = await database.projects.where('id').equals(task.projectId).first() as TProject

        return {
          ...todoListItem,
          taskTitle: task.title,
          taskStatus: task.status,
          projectTitle: project.title,
          taskDetails: task.details,
          selectedDate: todoListItem.todoListDate,
          todoListItemId: todoListItem.id
        }
      }))

      setSelectedDateActiveEntries(entries.filter(entry => TASK_STATUS_IS_ACTIVE[entry.taskStatus]))
    },
    [selectedDate]
  )

  const showAddNewTaskModal = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_TASK_MODAL } })
  }, [dispatch])

  const selectedDateActiveEntriesFiltered = useMemo(() => {
    return selectedDateActiveEntries.filter((_, index) => index < concurrentTodoListItems).map((it) => (<DoItem key={it.id} {...it} />))
  }, [selectedDateActiveEntries, concurrentTodoListItems])

  const handleNextTaskChange = useCallback(async (
  ) => {
    const nextSorterOrder = await getNextSortOrderValue(selectedDate)
    console.log('next sort', nextSorterOrder)
    const todoListItemDTO: Partial<TTodoListItem> = { sortOrder: nextSorterOrder }
    await database.todoListItems.where('id').equals(selectedDateActiveEntries[0].todoListItemId).modify(todoListItemDTO)
  }, [selectedDate, selectedDateActiveEntries])

  if (restoreInProgress) {
    return null
  }

  return (
    <Box css={pageCSS}>
      <Box css={{ display: 'flex', justifyContent: 'space-between', height: `${MENU_ITEMS_HEIGHT}px` }}>
        <ButtonGroup>
          <Button
            variant='contained'
            onClick={showAddNewTaskModal}
          >
            Add New Task
          </Button>
          <Button
            variant='contained'
            onClick={handleNextTaskChange}
          >
            Skip Task
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button
            variant='contained'
          >
            Start timer
          </Button>
        </ButtonGroup>
      </Box>
      <Box css={todolistItemsWrapperCSS}>
        {selectedDateActiveEntries.length === 0 && <EmptyTodoList />}
        {selectedDateActiveEntries.length > 0 && selectedDateActiveEntriesFiltered}
      </Box >
    </Box >
  )
}

const todolistItemsWrapperCSS = css`
  overflow: auto;
  height: calc(100vh - ${MENU_ITEMS_HEIGHT}px - ${HEADER_HEIGHT}px);
`

export default TodoList
