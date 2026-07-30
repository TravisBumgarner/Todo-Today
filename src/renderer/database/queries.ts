import moment from 'moment'
import { v4 as uuid } from 'uuid'
import { DATE_ISO_DATE_MOMENT_STRING, EDayOfWeek, ERecurringFrequency, ETaskStatus } from '../types'
import type { TDateISODate, TRecurringTask, TTask, TTodoList } from '../types'
import database from './database'

export const getTodoList = async (date: TDateISODate) => {
  return await database.todoList.where('date').equals(date).first()
}

export const getAndCreateIfNotExistsTodoList = async (date: TDateISODate): Promise<TTodoList> => {
  let todoList = await getTodoList(date)

  if (!todoList) {
    todoList = await upsertTodoList(date)
  }

  return todoList
}

export const getActiveTasks = async () => {
  const tasks = await database.tasks
    .where('status')
    .anyOf(ETaskStatus.BLOCKED, ETaskStatus.NEW, ETaskStatus.IN_PROGRESS)
    .toArray()
  return tasks
    .filter((task) => task.type !== 'recurring')
    .reduce<Record<string, TTask>>((acc, task) => {
      acc[task.id] = task
      return acc
    }, {})
}

export const upsertTodoList = async (date: TDateISODate, taskIds: string[] = []) => {
  const existingTodoList = await database.todoList.where('date').equals(date).first()

  if (existingTodoList) {
    await database.todoList.where('date').equals(date).modify({ taskIds })
    return { ...existingTodoList, taskIds }
  } else {
    const newTodoList = { date, taskIds, processedRecurringTasks: false }
    await database.todoList.add(newTodoList)
    return newTodoList
  }
}

export const addTask = async (task: TTask) => {
  await database.tasks.add(task)
}

export const addTaskToTodoList = async (date: TDateISODate, taskId: string) => {
  const todoList = await getAndCreateIfNotExistsTodoList(date)
  await database.todoList
    .where('date')
    .equals(date)
    .modify({ taskIds: [...(todoList?.taskIds ?? []), taskId] })
}

export const removeTaskFromTodoList = async (date: TDateISODate, taskId: string) => {
  const todoList = await getTodoList(date)
  await database.todoList
    .where('date')
    .equals(date)
    .modify({ taskIds: todoList?.taskIds.filter((id) => id !== taskId) ?? [] })
}

export const getPreviousDayActiveTasks = async (date: TDateISODate) => {
  const lastSelectedDate = (await database.todoList.toArray()).filter((entry) => entry.date < date).reverse()[0]
  if (!lastSelectedDate) return

  const previousDayTasks = await database.todoList.where({ date: lastSelectedDate.date }).first()
  const activeTasks = await getActiveTasks()

  const previousDayActiveTasks = previousDayTasks?.taskIds.filter((id) => activeTasks[id]) ?? []

  return previousDayActiveTasks
}

export const reorderTasks = async (date: TDateISODate, taskIds: string[]) => {
  await database.todoList.where('date').equals(date).modify({ taskIds })
}

export interface TTaskHistoryEntry {
  task: TTask
  /** Every day this task sat on a todo list, oldest first. Empty means it was
   * created but never scheduled. */
  dates: TDateISODate[]
}

/**
 * The join the history view needs: every task paired with the days it appeared
 * on a todo list. Nothing records when a task was worked on beyond its
 * membership in each day's list, so that membership *is* the history.
 */
export const getTaskHistory = async (): Promise<TTaskHistoryEntry[]> => {
  const [tasks, todoLists] = await Promise.all([database.tasks.toArray(), database.todoList.toArray()])

  const datesByTaskId = new Map<string, TDateISODate[]>()
  // ISO dates sort lexicographically, so walking the lists in date order leaves
  // each task's dates oldest-first for free.
  for (const todoList of todoLists.sort((a, b) => (a.date < b.date ? -1 : 1))) {
    for (const taskId of todoList.taskIds ?? []) {
      const dates = datesByTaskId.get(taskId)
      if (!dates) datesByTaskId.set(taskId, [todoList.date])
      else if (dates[dates.length - 1] !== todoList.date) dates.push(todoList.date)
    }
  }

  return tasks.map((task) => ({ task, dates: datesByTaskId.get(task.id) ?? [] }))
}

export const processRecurringTasksForToday = async (recurringTaskId?: string) => {
  const today = moment().format(DATE_ISO_DATE_MOMENT_STRING) as TDateISODate
  const todoList = await getAndCreateIfNotExistsTodoList(today)

  // If processing a specific task, skip the processedRecurringTasks check
  // Otherwise, only process if we haven't already processed today
  if (!recurringTaskId && todoList.processedRecurringTasks) {
    return
  }

  const currentDayOfWeek = moment().day() as EDayOfWeek
  const currentWeekOfYear = moment().week()
  const currentDayOfMonth = moment().date()

  // Get all recurring tasks or just the specific one
  const recurringTasks = recurringTaskId
    ? [await database.recurringTasks.get(recurringTaskId)].filter((task): task is TRecurringTask => task !== undefined)
    : await database.recurringTasks.toArray()

  const tasksToCreate: TTask[] = []

  for (const recurringTask of recurringTasks) {
    // Check if this recurring task should appear today
    const shouldAppearToday = recurringTask.daysOfWeek.includes(currentDayOfWeek)
    if (!shouldAppearToday) continue

    // Check frequency
    let frequencyMatches = false
    switch (recurringTask.frequency) {
      case ERecurringFrequency.EVERY_WEEK:
        frequencyMatches = true
        break
      case ERecurringFrequency.EVERY_OTHER_WEEK:
        // Alternate weeks (even/odd week numbers)
        frequencyMatches = currentWeekOfYear % 2 === 0
        break
      case ERecurringFrequency.MONTHLY:
        // First week of month (days 1-7)
        frequencyMatches = currentDayOfMonth <= 7
        break
    }

    if (!frequencyMatches) continue

    // Check if we already created this task for today
    // Get all tasks linked to this recurring task
    const linkedTasks = await database.tasks.where('recurringTaskId').equals(recurringTask.id).toArray()

    // Check if any of them are in today's todo list
    const alreadyCreated = linkedTasks.some((task) => todoList.taskIds.includes(task.id))

    if (alreadyCreated) continue

    // Create new task instance from template
    const newTask: TTask = {
      id: uuid(),
      title: recurringTask.title,
      status: recurringTask.status,
      details: recurringTask.details,
      type: 'recurring',
      recurringTaskId: recurringTask.id,
    }

    tasksToCreate.push(newTask)
  }

  // Add all tasks to database
  for (const task of tasksToCreate) {
    await addTask(task)
    await addTaskToTodoList(today, task.id)
  }

  // Mark today as processed only if processing all recurring tasks
  if (!recurringTaskId) {
    await database.todoList.where('date').equals(today).modify({ processedRecurringTasks: true })
  }
}
