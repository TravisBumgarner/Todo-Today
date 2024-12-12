import { ETaskStatus, type TDateISODate, type TTask, type TTodoList } from 'types'
import database from './database'

export const getTodoList = async (date: TDateISODate) => {
    return await database.todoList.where('date').equals(date).first()
}

export const getAndCreateIfNotExistsTodoList = async (date: TDateISODate): Promise<TTodoList> => {
    let todoList = await getTodoList(date)

    if (!todoList) {
        todoList = await addTodoList(date)
    }

    return todoList
}

export const getActiveTasks = async () => {
    const tasks = await database.tasks.where('status').anyOf(ETaskStatus.BLOCKED, ETaskStatus.NEW, ETaskStatus.IN_PROGRESS).toArray()
    return tasks.reduce<Record<string, TTask>>((acc, task) => {
        acc[task.id] = task
        return acc
    }, {})
}

const addTodoList = async (date: TDateISODate) => {
    const newTodoList = { date, taskIds: [] }
    await database.todoList.add(newTodoList)
    return newTodoList
}

export const addTask = async (task: TTask) => {
    await database.tasks.add(task)
}

export const addTaskToTodoList = async (date: TDateISODate, taskId: string) => {
    const todoList = await getAndCreateIfNotExistsTodoList(date)
    await database.todoList.where('date').equals(date).modify({ taskIds: [...(todoList?.taskIds ?? []), taskId] })
}

export const removeTaskFromTodoList = async (date: TDateISODate, taskId: string) => {
    const todoList = await getTodoList(date)
    await database.todoList.where('date').equals(date).modify({ taskIds: todoList?.taskIds.filter(id => id !== taskId) ?? [] })
}

export const setPreviousDayTasksForSelectedDate = async (date: TDateISODate) => {
    const lastSelectedDate = (await database.todoList.toArray()).filter(entry => entry.date < date).reverse()[0]
    if (!lastSelectedDate) return

    const previousDayTasks = await database.todoList.where({ date: lastSelectedDate.date }).first()
    const activeTasks = await getActiveTasks()

    const previousDayActiveTasks = previousDayTasks?.taskIds.filter(id => activeTasks[id]) ?? []

    await getAndCreateIfNotExistsTodoList(date)
    await database.todoList.where('date').equals(date).modify({ taskIds: [...previousDayActiveTasks] })
}

export const reorderTasks = async (date: TDateISODate, taskIds: string[]) => {
    await database.todoList.where('date').equals(date).modify({ taskIds })
}
