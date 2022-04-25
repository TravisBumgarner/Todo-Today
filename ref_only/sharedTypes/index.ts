enum ProjectStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    CANCELED = 'CANCELED',
    COMPLETED = 'COMPLETED',
}

type Project = {
    title: string
    description: string
    id: string
    status: ProjectStatus
}

type Task = {
    title: string,
    id: string,
    description: string
    projectId: string
}

type Agenda = Task['id'][]

type APIRRequest = {

}

type APIResponseFailure = {
    success: false
    error: string
}

type APIResponseSuccess = {
    success: true
    data: string | any
}

type APIResponse =
    | APIResponseFailure
    | APIResponseSuccess

export {
    APIRRequest,
    APIResponse,
    Project,
    ProjectStatus,
    Task,
    Agenda
}