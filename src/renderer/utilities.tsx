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
// gets turned into a plain <div> (block-level markup, so pasted paragraphs and
// table rows keep their line breaks) or unwrapped.
const ALLOWED_TAGS = new Set(['A', 'B', 'BR', 'DIV', 'EM', 'I', 'LI', 'OL', 'P', 'SPAN', 'STRONG', 'U', 'UL'])
const BLOCK_TAGS = new Set([
  'ADDRESS',
  'ARTICLE',
  'ASIDE',
  'BLOCKQUOTE',
  'DD',
  'DL',
  'DT',
  'FIGCAPTION',
  'FIGURE',
  'FOOTER',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'HEADER',
  'MAIN',
  'NAV',
  'PRE',
  'SECTION',
  'TABLE',
  'TD',
  'TH',
  'TR',
])
const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  A: new Set(['href']),
  SPAN: new Set(['class', 'data-checked']),
}
const NO_ATTRIBUTES = new Set<string>()
// The schemes the main process is willing to hand to the OS, so an href that
// would silently do nothing when clicked never survives sanitizing.
const SAFE_HREF = /^(https?:\/\/|mailto:)/i

const LINE_BLOCKS = new Set(['DIV', 'LI', 'OL', 'P', 'UL'])

/**
 * Put every checkbox line inside a block element.
 *
 * Chromium leaves the first line of a contenteditable unwrapped, so a checkbox
 * typed there is a direct child of the editor root with its text as a bare
 * sibling text node. Nothing then describes "that line", and line-level styling
 * (the strike-through on a ticked item) has nothing to hang on. Wrapping the run
 * of nodes that makes up the line gives it a home.
 *
 * Safe to run on a live editor: it only moves nodes, so a Range or caret sitting
 * in one of them survives.
 */
export const wrapCheckboxLines = (root: HTMLElement) => {
  const doc = root.ownerDocument
  const lines: Array<{ nodes: ChildNode[]; br: ChildNode | null }> = []
  let current: ChildNode[] = []

  for (const node of Array.from(root.childNodes)) {
    const isElement = node.nodeType === Node.ELEMENT_NODE
    const tagName = isElement ? (node as HTMLElement).tagName : ''

    if (tagName === 'BR') {
      lines.push({ nodes: current, br: node })
      current = []
    } else if (LINE_BLOCKS.has(tagName)) {
      // Already a block of its own — flush whatever preceded it and skip.
      if (current.length > 0) lines.push({ nodes: current, br: null })
      current = []
    } else {
      current.push(node)
    }
  }
  if (current.length > 0) lines.push({ nodes: current, br: null })

  for (const line of lines) {
    const hasCheckbox = line.nodes.some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).classList.contains('rte-check')
    )
    if (!hasCheckbox) continue

    const wrapper = doc.createElement('div')
    line.nodes[0].parentNode?.insertBefore(wrapper, line.nodes[0])
    for (const node of line.nodes) wrapper.appendChild(node)
    // The <div> is its own line break now, so the separator would double it up.
    line.br?.remove()
  }
}

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
      if (BLOCK_TAGS.has(element.tagName)) {
        const div = doc.createElement('div')
        div.append(...Array.from(element.childNodes))
        element.replaceWith(div)
      } else {
        element.replaceWith(...Array.from(element.childNodes))
      }
      continue
    }

    const allowed = ALLOWED_ATTRIBUTES[element.tagName] ?? NO_ATTRIBUTES
    for (const name of element.getAttributeNames()) {
      if (!allowed.has(name)) element.removeAttribute(name)
    }

    const href = element.getAttribute('href')
    if (href !== null && !SAFE_HREF.test(href)) element.removeAttribute('href')
  }

  wrapCheckboxLines(doc.body)

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

