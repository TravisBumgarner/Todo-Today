import { ProjectStatus } from '../sharedTypes'

const projectStatusLookup: Record<ProjectStatus, string> = {
    "CANCELED": "Canceled",
    "COMPLETED": "Completed",
    "IN_PROGRESS": "In Progress",
    "NEW": "New"
}

export {
    projectStatusLookup
}