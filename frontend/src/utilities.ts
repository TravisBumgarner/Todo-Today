import moment from 'moment'

import { TDateFormat, TProject, TProjectStatus, TTask, TDateISODate, TTaskStatus } from 'sharedTypes'

const projectStatusLookup: Record<TProjectStatus, string> = {
    [TProjectStatus.CANCELED]: "Canceled",
    [TProjectStatus.COMPLETED]: "Completed",
    [TProjectStatus.IN_PROGRESS]: "In Progress",
    [TProjectStatus.NEW]: "New"
}

const taskStatusLookup: Record<TTaskStatus, string> = {
    [TTaskStatus.CANCELED]: "Canceled",
    [TTaskStatus.COMPLETED]: "Completed",
    [TTaskStatus.IN_PROGRESS]: "In Progress",
    [TTaskStatus.NEW]: "New"
}

const dateFormatLookup = {
    [TDateFormat.A]: 'dddd MMMM Do YYYY',
    [TDateFormat.B]: 'dddd MMMM Do',
    [TDateFormat.C]: 'MM/DD/YY',
    [TDateFormat.D]: 'DD/MM/YY',
}

const formatDateDisplayString = (dateFormat: TDateFormat, date: TDateISODate| null): string => {
    if (date === null) {
        return ''
    }

    return moment(date).format(dateFormatLookup[dateFormat])
}

const formatDateKeyLookup = (date: moment.Moment): TDateISODate => {
    return date.format('YYYY-MM-DD') as TDateISODate
}

const formatDurationDisplayString = (rawMinutes: number) => {
    var hours = Math.floor(rawMinutes / 60)
    var minutes = rawMinutes % 60
    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes
    return hours + 'H' + paddedMinutes + "M"
}

const bucketTasksByProject = (projects: TProject[], tasks: TTask[] | undefined) => {
    const accumulator: Record<string, TTask[]> = {}

    projects.forEach(project => {
        accumulator[project.id] = []
    })

    
    if(tasks){
        Object.values(tasks).forEach((curr) => {
            accumulator[curr.projectId].push(curr)
        })
    }

    return accumulator
}

const sumArray = (arr: number[]) => arr.reduce((partialSum, a) => partialSum + a, 0)

const saveFile = async (fileName: string, jsonData: Object) => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
        setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
};

export {
    projectStatusLookup,
    taskStatusLookup,
    formatDateDisplayString,
    formatDateKeyLookup,
    formatDurationDisplayString,
    bucketTasksByProject,
    dateFormatLookup,
    sumArray,
    saveFile
}