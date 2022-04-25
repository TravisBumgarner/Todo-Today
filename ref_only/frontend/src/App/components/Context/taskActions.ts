
const TASK_CREATED = 'TASK_CREATED'
type TaskCreated = {
    type: typeof TASK_CREATED
    data: {
        id: string
        title: string
        description: string
        projectId: string
    }
}

const TASK_MODIFIED = 'TASK_MODIFIED'
type TaskModified = {
    type: typeof TASK_MODIFIED
    data: {
        id: string
        title: string
        description: string
        projectId: string
    }
}

const TASK_DELETED = 'TASK_DELETED'
type TaskDeleted = {
    type: typeof TASK_DELETED
    data: {
        id: string
    }
}

type TaskAction =
    | TaskCreated
    | TaskModified
    | TaskDeleted

export {
    TaskAction,
    TASK_CREATED,
    TASK_MODIFIED,
    TASK_DELETED
}