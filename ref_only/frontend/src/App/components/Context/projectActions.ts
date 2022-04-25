import { ProjectStatus } from '../../../../../sharedTypes'

const PROJECT_CREATED = 'PROJECT_CREATED'
type ProjectCreated = {
    type: typeof PROJECT_CREATED
    data: {
        id: string
        title: string
        description: string
        status: ProjectStatus
    }
}

const PROJECT_MODIFIED = 'PROJECT_MODIFIED'
type ProjectModified = {
    type: typeof PROJECT_MODIFIED
    data: {
        id: string
        title: string
        description: string
        status: ProjectStatus
    }
}

const PROJECT_DELETED = 'PROJECT_DELETED'
type ProjectDeleted = {
    type: typeof PROJECT_DELETED
    data: {
        id: string
    }
}

type ProjectAction =
    | ProjectCreated
    | ProjectModified
    | ProjectDeleted


export {

    PROJECT_CREATED,
    PROJECT_DELETED,
    PROJECT_MODIFIED,
    ProjectAction
}