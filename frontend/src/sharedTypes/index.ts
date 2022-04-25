type ProjectStatus = 'NEW' | "IN_PROGRESS" | "COMPLETED" | "CANCELED"

type Project = {
    id: string
    title: string
    description: string
    startDate: string | null
    endDate: string | null
    status: ProjectStatus
}

export {
    Project
}