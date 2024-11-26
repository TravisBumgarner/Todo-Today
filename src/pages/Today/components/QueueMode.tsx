import { ChevronRight } from '@mui/icons-material'
import { Box, Button, ButtonGroup, Stack, ToggleButton, Tooltip, Typography, css } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import _ from 'lodash'
import moment from 'moment'
import { useCallback, useContext, useState } from 'react'

import { context } from 'Context'
import database from 'database'
import { Reorder } from 'framer-motion'
import { ModalID } from 'modals'
import { globalButtonsWrapperCSS, globalContentWrapperCSS } from 'theme'
import { DATE_ISO_DATE_MOMENT_STRING, type TProject, type TTask } from 'types'
import { TASK_STATUS_IS_ACTIVE, formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import EmptyTodoList from './EmptyTodoList'
import ModeToggle from './ModeToggle'
import QueueItem, { type QueueItemEntry } from './QueueItem'

const TodoList = () => {
  const { state: { selectedDate, activeWorkspaceId, restoreInProgress }, dispatch } = useContext(context)
  const [activeEntries, setActiveEntries] = useState<QueueItemEntry[]>([])
  const [activeEntryIds, setActiveEntryIds] = useState<string[]>([])

  const [inactiveEntries, setInactiveEntries] = useState<QueueItemEntry[]>([])
  const [inactiveEntryIds, setInactiveEntryIds] = useState<string[]>([])

  const [showArchive, setShowArchive] = useState(false)

  useLiveQuery(
    async () => {
      const todoListItems = await database.todoListItems
        .where({ todoListDate: selectedDate, workspaceId: activeWorkspaceId })
        .toArray()

      const entries = await Promise.all(todoListItems.map(async todoListItem => {
        const task = await database.tasks.where('id').equals(todoListItem.taskId).first() as TTask
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

      setActiveEntryIds(activeEntries.map(it => it.id))
      setInactiveEntryIds(inactiveEntries.map(it => it.id))

      setActiveEntries(activeEntries)
      setInactiveEntries(inactiveEntries)
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

  const toggleShowArchive = useCallback(() => { setShowArchive(prev => !prev) }, [])

  const getEntryById = useCallback((id: string) => {
    return [...activeEntries, ...inactiveEntries].find(it => it.id === id) as QueueItemEntry
  }, [activeEntries, inactiveEntries])

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
        {activeEntries.length === 0 && inactiveEntries.length === 0 && <EmptyTodoList />}
        <Reorder.Group axis="y" values={activeEntryIds} onReorder={setActiveEntryIds}>
          {activeEntryIds.map((id) => (<Reorder.Item value={id} key={id}><QueueItem {...getEntryById(id)} /></Reorder.Item>))}
        </Reorder.Group>

        {(inactiveEntries.length > 0) && (
          <>
            <Stack direction="row" css={{ marginBottom: '0.5rem' }}>
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
          </>
        )}
        {showArchive && inactiveEntries.map((it) => <QueueItem key={it.id} {...it} />)}
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
