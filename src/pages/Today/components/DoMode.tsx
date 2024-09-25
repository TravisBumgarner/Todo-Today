import { Box, Button, ButtonGroup, Typography } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useContext, useMemo, useState } from 'react'

import { context } from 'Context'
import database from 'database'
import { ModalID } from 'modals'
import { globalButtonsWrapperCSS, globalContentWrapperCSS } from 'theme'
import { type TProject, type TTask, type TTodoListItem } from 'types'
import { TASK_STATUS_IS_ACTIVE, getNextSortOrderValue } from 'utilities'
import DoItem, { type DoModeEntry } from './DoItem'
import ModeToggle from './ModeToggle'
import Timer from './Timer'
import { emptyTodoListCSS } from './sharedCSS'

const EmptyTodoList = () => {
  return (
    <Box css={emptyTodoListCSS}>
      <Box>
        <Typography variant='h2'>Switch to queue mode to pick tasks</Typography>
      </Box>
    </Box>
  )
}

const TodoList = () => {
  const { state: { selectedDate, restoreInProgress, activeWorkspaceId, settings: { concurrentTodoListItems } }, dispatch } = useContext(context)
  const [selectedDateActiveEntries, setSelectedDateActiveEntries] = useState<DoModeEntry[]>([])

  useLiveQuery(
    async () => {
      const todoListItems = await database.todoListItems
        .where({ todoListDate: selectedDate, workspaceId: activeWorkspaceId })
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
    const todoListItemDTO: Partial<TTodoListItem> = { sortOrder: nextSorterOrder }
    await database.todoListItems.where('id').equals(selectedDateActiveEntries[0].todoListItemId).modify(todoListItemDTO)
  }, [selectedDate, selectedDateActiveEntries])

  if (restoreInProgress) {
    return null
  }

  return (
    <>
      <Box css={globalButtonsWrapperCSS}>
        <Box>

          <ModeToggle />
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
              Skip Current Task
            </Button>
          </ButtonGroup>
        </Box>
        <Timer />
      </Box>
      <Box css={globalContentWrapperCSS}>
        {selectedDateActiveEntries.length === 0 && <EmptyTodoList />}
        {selectedDateActiveEntries.length > 0 && selectedDateActiveEntriesFiltered}
      </Box >
    </>
  )
}

export default TodoList
