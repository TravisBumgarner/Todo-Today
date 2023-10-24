import { useContext, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Box, Typography, css } from '@mui/material'

import database from 'database'
import { type TProject, type TTask } from 'types'
import { context } from 'Context'
import DoItem, { type Entry } from './DoItem'
import { TASK_STATUS_IS_ACTIVE } from 'utilities'
import { pageCSS } from 'theme'
import Timer from './Timer'
import DeclutterYourMind from './DeclutterYourMind'

const EmptyTodoList = () => {
  return (
    <Box css={emptyTodoListCSS}>
      <Typography css={css`margin-bottom: 1rem`} variant='h2'>Empty State?</Typography>
    </Box>
  )
}

const TodoList = () => {
  const { state: { selectedDate, restoreInProgress, settings: { concurrentTodoListItems } } } = useContext(context)
  const [selectedDateActiveEntries, setSelectedDateActiveEntries] = useState<Entry[]>([])

  // Todo might need a new home for this query. Maybe Todo.tsx/
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

      setSelectedDateActiveEntries(entries.filter(entry => TASK_STATUS_IS_ACTIVE[entry.taskStatus]))
    },
    [selectedDate]
  )

  const selectedDateActiveEntriesFiltered = useMemo(() => {
    console.log(concurrentTodoListItems)
    return selectedDateActiveEntries.filter((_, index) => index < concurrentTodoListItems).map((it) => (<DoItem key={it.id} {...it} />))
  }, [selectedDateActiveEntries, concurrentTodoListItems])

  if (restoreInProgress) {
    return null
  }

  return (
    <Box css={pageCSS}>
      <Timer />
      <Box css={todolistItemsWrapperCSS}>
        {selectedDateActiveEntriesFiltered.length === 0 && <EmptyTodoList />}
        {selectedDateActiveEntriesFiltered.length > 0 && selectedDateActiveEntriesFiltered}
      </Box >
      <DeclutterYourMind />
    </Box >
  )
}

const todolistItemsWrapperCSS = css`
  overflow: auto;
`

const emptyTodoListCSS = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`

export default TodoList
