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

/**
 * Tally the "[]" checkboxes RichTextEditor writes into a task's details, so a
 * collapsed task can still show how far along its checklist is.
 */
export const countChecklist = (details: string) => {
  if (!details.includes("rte-check")) return { total: 0, checked: 0 };

  const boxes = new DOMParser()
    .parseFromString(details, "text/html")
    .querySelectorAll(".rte-check");

  let checked = 0;
  boxes.forEach((box) => {
    if (box.getAttribute("data-checked") === "true") checked += 1;
  });

  return { total: boxes.length, checked };
};

/**
 * The visible text of a details blob, for searching over and for one-line
 * previews. Checkbox spans carry their state in an attribute rather than in
 * text, so they contribute nothing here — which is what we want.
 */
export const htmlToPlainText = (html: string) => {
  if (!html) return ''

  const text = new DOMParser().parseFromString(html, 'text/html').body.textContent ?? ''
  return text.replace(/\s+/g, ' ').trim()
}

// The tags and attributes RichTextEditor actually produces. Everything else
// gets unwrapped or dropped.
const ALLOWED_TAGS = new Set(['A', 'B', 'BR', 'DIV', 'EM', 'I', 'LI', 'OL', 'P', 'SPAN', 'STRONG', 'U', 'UL'])
const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  A: new Set(['href']),
  SPAN: new Set(['class', 'data-checked']),
}
const NO_ATTRIBUTES = new Set<string>()

/**
 * Reduce a details blob to the small subset of HTML the editor writes, for
 * places that render it as markup rather than editing it. Details are
 * app-authored, but they also round-trip through the backup files Settings can
 * restore from, so nothing in them is taken on faith.
 */
export const sanitizeDetailsHtml = (html: string) => {
  if (!html) return ''

  const doc = new DOMParser().parseFromString(html, 'text/html')

  // querySelectorAll is a static snapshot in document order, so unwrapping an
  // element still leaves its children to be visited on a later iteration.
  for (const element of Array.from(doc.body.querySelectorAll('*'))) {
    if (!ALLOWED_TAGS.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes))
      continue
    }

    const allowed = ALLOWED_ATTRIBUTES[element.tagName] ?? NO_ATTRIBUTES
    for (const name of element.getAttributeNames()) {
      if (!allowed.has(name)) element.removeAttribute(name)
    }

    const href = element.getAttribute('href')
    if (href !== null && !/^https?:\/\//i.test(href)) element.removeAttribute('href')
  }

  return doc.body.innerHTML
}

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

