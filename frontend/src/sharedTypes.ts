import moment from "moment"

enum TProjectStatus {
    NEW = 'NEW',
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
}

type TProject = {
    id: string
    title: string
    startDate: moment.Moment | null
    endDate: moment.Moment | null
    status: TProjectStatus
}

enum TTaskStatus {
    NEW = 'NEW',
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
}

type TTask = {
    id: string
    projectId: string
    title: string
    status: TTaskStatus
}

type EnumTypeString<TEnum extends string> =
    { [key in string]: TEnum | string; }

type EnumTypeNumber<TEnum extends number> =
    { [key in string]: TEnum | number; }
    | { [key in number]: string; }

type EnumType<TEnum extends string | number> =
    (TEnum extends string ? EnumTypeString<TEnum> : never)
    | (TEnum extends number ? EnumTypeNumber<TEnum> : never)

export {
    TProject,
    TProjectStatus,
    TTask,
    TTaskStatus,
    EnumType
}