import { TTaskStatus, TTask, TProjectStatus, TProject } from "sharedTypes"


const FAKE_TASKS: Record<string, TTask> = {
    '1': {
        id: "1",
        title: "PTO",
        status: TTaskStatus.NEW,
        projectId: "1"
    },
    '2': {
        id: "2",
        title: "Sick Time",
        status: TTaskStatus.IN_PROGRESS,
        projectId: "1"
    }
}

const FAKE_PROJECTS: Record<string, TProject> = {
    '1': {
        id: "1",
        title: "PTO",
        status: TProjectStatus.IN_PROGRESS,
        startDate: null,
        endDate: null,
    },
    '2': {
        id: "2",
        title: "Sick Time",
        status: TProjectStatus.IN_PROGRESS,
        startDate: null,
        endDate: null,
    }
}

export {
    FAKE_PROJECTS,
    FAKE_TASKS
}
