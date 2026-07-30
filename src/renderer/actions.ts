import moment from 'moment'
import { queries } from './database'
import { ModalID } from './modals/ids'
import { activeModalSignal, messageSignal, selectedDateSignal } from './signals'
import { DATE_ISO_DATE_MOMENT_STRING, type TDateISODate } from './types'
import { formatDateKeyLookup } from './utilities'

// The toolbar buttons and the keyboard shortcuts both go through here so the
// two can't drift apart.

export const goToPreviousDay = () => {
  selectedDateSignal.value = formatDateKeyLookup(
    moment(selectedDateSignal.value, DATE_ISO_DATE_MOMENT_STRING).subtract(1, 'day'),
  )
}

export const goToNextDay = () => {
  selectedDateSignal.value = formatDateKeyLookup(
    moment(selectedDateSignal.value, DATE_ISO_DATE_MOMENT_STRING).add(1, 'day'),
  )
}

export const goToToday = () => {
  selectedDateSignal.value = formatDateKeyLookup(moment())
}

export const openNewTaskModal = () => {
  activeModalSignal.value = { id: ModalID.NEW_TASK_MODAL }
}

export const openSelectTasksModal = () => {
  activeModalSignal.value = { id: ModalID.SELECT_TASKS_MODAL }
}

export const openRecurringTasksModal = () => {
  activeModalSignal.value = { id: ModalID.RECURRING_TASKS_MODAL }
}

export const openSettingsModal = () => {
  activeModalSignal.value = { id: ModalID.SETTINGS_MODAL }
}

export const openHistoryModal = () => {
  activeModalSignal.value = { id: ModalID.HISTORY_MODAL }
}

/** Jump the todo list to a specific day and get out of the way. */
export const goToDate = (date: TDateISODate) => {
  selectedDateSignal.value = date
  activeModalSignal.value = null
}

/**
 * Copies the previous day's still-active tasks into the selected day, MERGING
 * with whatever is already there (e.g. recurring tasks) rather than replacing
 * it.
 */
export const copyPreviousDay = async () => {
  const date = selectedDateSignal.value
  const previousDayActiveTasks = await queries.getPreviousDayActiveTasks(date)

  if (!previousDayActiveTasks || previousDayActiveTasks.length === 0) {
    messageSignal.value = {
      severity: 'error',
      text: 'No tasks to copy from the previous day',
    }
    return
  }

  const todoList = await queries.getAndCreateIfNotExistsTodoList(date)
  const existing = todoList.taskIds ?? []
  const merged = [...existing]
  for (const id of previousDayActiveTasks) {
    if (!merged.includes(id)) merged.push(id)
  }

  const added = merged.length - existing.length
  await queries.upsertTodoList(date, merged)

  messageSignal.value = {
    severity: added > 0 ? 'success' : 'info',
    text:
      added > 0
        ? `Copied ${added} task${added === 1 ? '' : 's'} from the previous day`
        : "Those tasks are already on today's list",
  }
}
