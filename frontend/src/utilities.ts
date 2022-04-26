import moment from 'moment'
import { TProjectStatus } from 'sharedTypes'

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


export {
    projectStatusLookup,
    formatDateDisplayString
}