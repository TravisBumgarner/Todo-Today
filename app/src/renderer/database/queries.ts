import moment from 'moment'
import { v4 as uuid } from 'uuid'
import { DATE_ISO_DATE_MOMENT_STRING, EDayOfWeek, ERecurringFrequency, ETaskStatus } from '../types'
import type { TDateISODate, TSubtask, TTask, TTodoList } from '../types'
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
  return tasks.reduce<Record<string, TTask>>((acc, task) => {
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

export const insertSubtask = async (taskId: string, subtask: TSubtask) => {
  const task = await database.tasks.where('id').equals(taskId).first()
  await database.tasks
    .where('id')
    .equals(taskId)
    .modify({ subtasks: [...(task?.subtasks ?? []), subtask] })
}

export const updateSubtask = async (taskId: string, subtaskId: string, subtaskUpdate: Partial<TSubtask>) => {
  const task = await database.tasks.where('id').equals(taskId).first()
  await database.tasks
    .where('id')
    .equals(taskId)
    .modify({
      subtasks: task?.subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, ...subtaskUpdate } : subtask,
      ),
    })
}

export const deleteSubtask = async (taskId: string, subtaskId: string) => {
  const task = await database.tasks.where('id').equals(taskId).first()
  await database.tasks
    .where('id')
    .equals(taskId)
    .modify({
      subtasks: task?.subtasks.filter((subtask) => subtask.id !== subtaskId),
    })
}

export const getSubtask = async (taskId: string, subtaskId: string) => {
  const task = await database.tasks.where('id').equals(taskId).first()
  return task?.subtasks.find((subtask) => subtask.id === subtaskId)
}

export const processRecurringTasksForToday = async () => {
  const today = moment().format(DATE_ISO_DATE_MOMENT_STRING) as TDateISODate
  const todoList = await getAndCreateIfNotExistsTodoList(today)

  // Only process if we haven't already processed today
  if (todoList.processedRecurringTasks) {
    return
  }

  const currentDayOfWeek = moment().day() as EDayOfWeek
  const currentWeekOfYear = moment().week()
  const currentDayOfMonth = moment().date()

  // Get all recurring tasks
  const recurringTasks = await database.recurringTasks.toArray()

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
      subtasks: [],
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

  // Mark today as processed
  await database.todoList.where('date').equals(today).modify({ processedRecurringTasks: true })
}
