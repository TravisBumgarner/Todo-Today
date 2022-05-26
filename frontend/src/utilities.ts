import moment from 'moment'
import { EDateFormat, TProject, EProjectStatus, TTask, TDateISODate, ETaskStatus, EDaysOfWeek, EColorTheme, EBackupInterval } from 'sharedTypes'
import { NotificationIPC } from '../../shared/types'

const { ipcRenderer } = window.require('electron')

const projectStatusLookup: Record<EProjectStatus, string> = {
    [EProjectStatus.REOCURRING]: 'Reoccuring',
    [EProjectStatus.CANCELED]: 'Canceled',
    [EProjectStatus.COMPLETED]: 'Completed',
    [EProjectStatus.IN_PROGRESS]: 'In Progress',
    [EProjectStatus.NEW]: 'New',
}

const backupIntervalLookup: Record<EBackupInterval, string> = {
    [EBackupInterval.MINUTELY]: 'Every Minute',
    [EBackupInterval.HOURLY]: 'Ever Hour',
    [EBackupInterval.DAILY]: 'Every Day',
    [EBackupInterval.WEEKLY]: 'Every Week',
    [EBackupInterval.MONTHLY]: 'Every Month',
    [EBackupInterval.OFF]: 'Off',
}

const taskStatusLookup: Record<ETaskStatus, string> = {
    [ETaskStatus.CANCELED]: 'Canceled',
    [ETaskStatus.COMPLETED]: 'Completed',
    [ETaskStatus.IN_PROGRESS]: 'In Progress',
    [ETaskStatus.NEW]: 'New'
}

const dayOfWeekLabels: Record<EDaysOfWeek, string> = {
    [EDaysOfWeek.SUNDAY]: 'Sunday',
    [EDaysOfWeek.MONDAY]: 'Monday',
    [EDaysOfWeek.TUESDAY]: 'Tuesday',
    [EDaysOfWeek.WEDNESDAY]: 'Wednesday',
    [EDaysOfWeek.THURSDAY]: 'Thursday',
    [EDaysOfWeek.FRIDAY]: 'Friday',
    [EDaysOfWeek.SATURDAY]: 'Saturday',
}

const colorThemeOptionLabels: Record<EColorTheme, string> = {
    [EColorTheme.BEACH]: 'Beach',
    [EColorTheme.NEWSPAPER]: 'Newspaper',
    [EColorTheme.OUTERSPACE]: 'Outerspace',
    [EColorTheme.RETRO_FUTURE]: 'Retro Future',
    [EColorTheme.SLATE]: 'Slate',
    [EColorTheme.SUNSET]: 'Sunset',
    [EColorTheme.UNDER_THE_SEA]: 'Under the Sea',
}

const dateFormatLookup = {
    [EDateFormat.A]: 'dddd MMMM Do YYYY',
    [EDateFormat.B]: 'dddd MMMM Do',
    [EDateFormat.C]: 'MM/DD/YY',
    [EDateFormat.D]: 'DD/MM/YY',
}

const formatDateDisplayString = (dateFormat: EDateFormat, date: TDateISODate | null): string => {
    if (date === null) {
        return ''
    }

    return moment(date).format(dateFormatLookup[dateFormat])
}

const formatDateKeyLookup = (date: moment.Moment): TDateISODate => {
    return date.format('YYYY-MM-DD') as TDateISODate
}

const formatDurationDisplayString = (rawMinutes: number) => {
    const hours = Math.floor(rawMinutes / 60)
    const minutes = rawMinutes % 60
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    return `${hours}H${paddedMinutes}`
}

const bucketTasksByProject = (projects: TProject[], tasks: TTask[] | undefined) => {
    const accumulator: Record<string, TTask[]> = {}

    projects.forEach((project) => {
        accumulator[project.id] = []
    })

    if (tasks) {
        Object.values(tasks).forEach((curr) => {
            if (curr.projectId in accumulator) {
                accumulator[curr.projectId].push(curr)
            }
        })
    }

    return accumulator
}

const sumArray = (arr: number[]) => arr.reduce((partialSum, a) => partialSum + a, 0)

const saveFile = async (fileName: string, jsonData: Object) => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.download = fileName
    a.href = URL.createObjectURL(blob)
    a.addEventListener('click', () => {
        setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000)
    })
    a.click()
}

const sendNotification = (title: string, body: string) => {
    ipcRenderer.send('notification', { title, body } as NotificationIPC)
}

const getLocalStorage = (key: string) => {
    const result = localStorage.getItem(key)
    return result ? JSON.parse(result) : ''
}

const setLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
}

export {
    projectStatusLookup,
    taskStatusLookup,
    formatDateDisplayString,
    formatDateKeyLookup,
    formatDurationDisplayString,
    bucketTasksByProject,
    dateFormatLookup,
    dayOfWeekLabels,
    colorThemeOptionLabels,
    backupIntervalLookup,
    sumArray,
    saveFile,
    sendNotification,
    getLocalStorage,
    setLocalStorage
}
