import moment from "moment";
import Icon from "./components/Icon";

export const logMessage = (message: string) => {
  console.log(message);
  // if (import.meta.env.VITE_API_URL) {
  //   console.log(message);
  // } else {
  //   log.info(message);
  // }
};

import {
  DATE_ISO_DATE_MOMENT_STRING,
  ETaskStatus,
  type TDateISODate,
} from "./types";

export const TASK_STATUS_IS_ACTIVE: Record<ETaskStatus, boolean> = {
  [ETaskStatus.CANCELED]: false,
  [ETaskStatus.COMPLETED]: false,
  [ETaskStatus.IN_PROGRESS]: true,
  [ETaskStatus.NEW]: true,
  [ETaskStatus.BLOCKED]: true,
};

const taskStatusLookup: Record<ETaskStatus, string> = {
  [ETaskStatus.CANCELED]: "Canceled",
  [ETaskStatus.COMPLETED]: "Completed",
  [ETaskStatus.IN_PROGRESS]: "In Progress",
  [ETaskStatus.NEW]: "Queued",
  [ETaskStatus.BLOCKED]: "Blocked",
};

const formatDateDisplayString = (date: TDateISODate | null): string => {
  if (date === null) {
    return "";
  }

  return moment(date, DATE_ISO_DATE_MOMENT_STRING).format("ddd, MMM Do");
};

const formatDateKeyLookup = (date: moment.Moment): TDateISODate => {
  return date.format("YYYY-MM-DD") as TDateISODate;
};

const formatDurationDisplayString = (rawMinutes: number) => {
  const hours = Math.floor(rawMinutes / 60);
  const minutes = rawMinutes % 60;
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${paddedMinutes}`;
};

const sumArray = (arr: number[]) =>
  arr.reduce((partialSum, a) => partialSum + a, 0);

export const sortStrings = (a: string, b: string) =>
  a.toLocaleLowerCase() > b.toLocaleLowerCase() ? 1 : -1;

const saveFile = async (fileName: string, jsonData: unknown) => {
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.addEventListener("click", () => {
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
    }, 30 * 1000);
  });
  a.click();
};

const taskStatusIcon = (taskStatus: ETaskStatus, color?: string) => {
  switch (taskStatus) {
    case ETaskStatus.CANCELED:
      return <Icon.CanceledIcon color={color} />;
    case ETaskStatus.BLOCKED:
      return <Icon.BlockedIcon color={color} />;
    case ETaskStatus.NEW:
      return <Icon.NewIcon color={color} />;
    case ETaskStatus.IN_PROGRESS:
      return <Icon.InProgressIcon color={color} />;
    case ETaskStatus.COMPLETED:
      return <Icon.CompletedIcon color={color} />;
  }
};

export {
  formatDateDisplayString,
  formatDateKeyLookup,
  formatDurationDisplayString,
  saveFile,
  // sendAsyncIPCMessage,
  // sendSyncIPCMessage,
  sumArray,
  taskStatusIcon,
  taskStatusLookup
};

