import moment from 'moment'
import { useEffect } from 'react'
import { v4 as uuid4 } from 'uuid'
import { queries } from '../database'
import { ETaskStatus } from '../types'
import { formatDateKeyLookup } from '../utilities'

/** Adds tasks sent via todo-today://add?title=… to today's list. */
const useAddTaskFromUrl = () => {
  useEffect(() => {
    return window.electron.onAddTask(async (title) => {
      const id = uuid4()
      await queries.addTask({ id, title, status: ETaskStatus.NEW, details: '', type: 'regular' })
      await queries.addTaskToTodoList(formatDateKeyLookup(moment()), id)
    })
  }, [])
}

export default useAddTaskFromUrl
