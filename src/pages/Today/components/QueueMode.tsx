import { Box, Button, ButtonGroup, css } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import moment from 'moment'
import { useCallback, useContext, useState } from 'react'

import { context } from 'Context'
import database from 'database'
import { Reorder } from 'framer-motion'
import { ModalID } from 'modals'
import { globalButtonsWrapperCSS, globalContentWrapperCSS } from 'theme'
import { DATE_ISO_DATE_MOMENT_STRING } from 'types'
import { formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import EmptyTodoList from './EmptyTodoList'
import ModeToggle from './ModeToggle'
import QueueItem from './QueueItem'

const TodoList = () => {
  const { state: { selectedDate, activeWorkspaceId, restoreInProgress }, dispatch } = useContext(context)
  // Store sort order separately which avoids the need for something like fractional indexing.
  const [entryIds, setEntryIds] = useState<string[]>([])

  // When sort order is changed, update local state and sync a copy to the database.
  const updateEntryIds = useCallback((newActiveEntryIds: string[]) => {
    setEntryIds(newActiveEntryIds)

    void database.todoListSortOrder.put({
      workspaceId: activeWorkspaceId,
      todoListDate: selectedDate,
      sortOrder: newActiveEntryIds
    })
  }, [activeWorkspaceId, selectedDate])

  // When new items are added/updated via useLiveQuery, check current sort order and append any new ids.
  const syncDexieWithLocalActiveEntryIds = useCallback((newEntryIds: string[]) => {
    const patch: string[] = []
    entryIds.forEach(entryId => {
      // Maintain sort order for any item in both lists.
      if (newEntryIds.includes(entryId)) {
        patch.push(entryId)
      }
    })

    newEntryIds.forEach(entryId => {
      // If new item is found, add it to list.
      if (!entryIds.includes(entryId)) {
        patch.push(entryId)
      }
    })
    console.log(patch)
    updateEntryIds(patch)
  }, [entryIds, updateEntryIds])

  useLiveQuery(
    async () => {
      const entryIds = (await database.todoListSortOrder.where({ todoListDate: selectedDate, workspaceId: activeWorkspaceId }).first())?.sortOrder
      console.log('sortorder', entryIds)
      syncDexieWithLocalActiveEntryIds(entryIds ?? [])
    },
    [selectedDate, activeWorkspaceId]
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
              onClick={showManagementModal}
              variant='contained'
            >
              Select Tasks
            </Button>
          </ButtonGroup>
        </Box>
        <ButtonGroup>
          <Button variant='contained' onClick={setPreviousDate}>&lt;</Button>
          <Button variant='contained' css={todayButtonCSS} onClick={getToday}><span>{formatDateDisplayString(selectedDate)}</span></Button>
          <Button variant='contained' onClick={getNextDate}>&gt;</Button>
        </ButtonGroup>
      </Box>

      <Box css={globalContentWrapperCSS}>
        {entryIds.length === 0 && <EmptyTodoList />}
        <Reorder.Group style={{ listStyleType: 'none', padding: 0 }} axis="y" values={entryIds} onReorder={updateEntryIds}>
          {entryIds.map((id) => (<Reorder.Item value={id} key={id}><QueueItem id={id} /></Reorder.Item>))}
        </Reorder.Group>
      </Box >
    </ >
  )
}

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
