enum TProjectStatus {
    NEW = 'NEW',
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
}

type TProject = {
    id: string
    title: string
    startDate: string
    endDate: string | null
    status: TProjectStatus
}

export {
    TProject,
    TProjectStatus
}