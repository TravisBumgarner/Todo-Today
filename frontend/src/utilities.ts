import moment from 'moment'

const { ipcRenderer } = window.require('electron')
import { EDateFormat, TProject, EProjectStatus, TTask, TDateISODate, ETaskStatus } from 'sharedTypes'
import { NotificationIPC } from '../../shared/types'

const projectStatusLookup: Record<EProjectStatus, string> = {
    [EProjectStatus.CANCELED]: 'Canceled',
    [EProjectStatus.COMPLETED]: 'Completed',
    [EProjectStatus.IN_PROGRESS]: 'In Progress',
    [EProjectStatus.NEW]: 'New'
}

const taskStatusLookup: Record<ETaskStatus, string> = {
    [ETaskStatus.CANCELED]: 'Canceled',
    [ETaskStatus.COMPLETED]: 'Completed',
    [ETaskStatus.IN_PROGRESS]: 'In Progress',
    [ETaskStatus.NEW]: 'New'
}

const dateFormatLookup = {
    [EDateFormat.A]: 'dddd MMMM Do YYYY',
    [EDateFormat.B]: 'dddd MMMM Do',
    [EDateFormat.C]: 'MM/DD/YY',
    [EDateFormat.D]: 'DD/MM/YY',
}

const formatDateDisplayString = (dateFormat: EDateFormat, date: TDateISODate| null): string => {
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
            accumulator[curr.projectId].push(curr)
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
    ipcRenderer.send('notification', {title, body} as NotificationIPC)
}

export {
    projectStatusLookup,
    taskStatusLookup,
    formatDateDisplayString,
    formatDateKeyLookup,
    formatDurationDisplayString,
    bucketTasksByProject,
    dateFormatLookup,
    sumArray,
    saveFile,
    sendNotification
}
