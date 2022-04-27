import moment from 'moment'
import { TProjectStatus, TTask} from 'sharedTypes'

const projectStatusLookup: Record<TProjectStatus, string> = {
    "CANCELED": "Canceled",
    "COMPLETED": "Completed",
    "IN_PROGRESS": "In Progress",
    "NEW": "New"
}

const formatDateDisplayString = (date: moment.Moment | null): string => {
    if (date === null) {
        return ''
    }

    return date.format('YYYY-MM-DD')
}

const formatDateKeyLookup = (date: moment.Moment): string => {
    return date.format('YYYY-MM-DD')
}

const formatDurationDisplayString = (rawMinutes: number) => {
    var hours = Math.floor(rawMinutes / 60)
    var minutes = rawMinutes % 60

    const paddedHours = hours < 10 ? '0' + hours : hours
    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes
    return paddedHours + ':' + paddedMinutes
}

const bucketTasksByProject = (tasks: TTask[]): Record<string, TTask[]> => {
    return tasks.reduce((accumulator, curr) => {
        if (!(curr.projectId in accumulator)) {
            accumulator[curr.projectId] = []
        }

        accumulator[curr.projectId].push(curr)

        return accumulator
    }, {} as Record<string, TTask[]>)
}


export {
    projectStatusLookup,
    formatDateDisplayString,
    formatDateKeyLookup,
    formatDurationDisplayString,
    bucketTasksByProject
}