import moment from 'moment'
import { TProject, TProjectStatus, TTask} from 'sharedTypes'

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

const bucketTasksByProject = (projects: Record<string, TProject>  , tasks: Record<string, TTask>) => {
    const accumulator: Record<string, TTask[]> = {}

    Object.keys(projects).forEach(key => {
        accumulator[key] = []
    })

    Object.values(tasks).forEach((curr) => {
        accumulator[curr.projectId].push(curr)
    })

    return accumulator
}


export {
    projectStatusLookup,
    formatDateDisplayString,
    formatDateKeyLookup,
    formatDurationDisplayString,
    bucketTasksByProject
}