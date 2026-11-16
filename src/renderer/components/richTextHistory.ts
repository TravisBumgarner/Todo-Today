import { type RefObject, useCallback, useRef } from 'react'

/**
 * Undo/redo for RichTextEditor.
 *
 * Chromium keeps its own undo stack for a contenteditable, but it only knows
 * about edits it performed itself. The editor inserts, removes and ticks
 * checkboxes with plain DOM calls — Chromium never sees those, so its stack
 * comes out of sync: undo strips the text off a checklist item and leaves the
 * checkbox stranded, and a deleted checkbox can never be brought back. Owning
 * the whole stack is the only way to keep the two in step, which is the same
 * conclusion every other contenteditable editor reaches.
 *
 * The model is a list of snapshots with a cursor into it: `stack[index]` is
 * always what the editor currently shows, undo walks the cursor back, redo
 * walks it forward, and a fresh edit truncates whatever was ahead.
 */

/** A point-in-time copy of the editor: its markup plus where the selection sat. */
export interface Snapshot {
  html: string
  anchor: number[] | null
  anchorOffset: number
  focus: number[] | null
  focusOffset: number
}

const MAX_ENTRIES = 200
// Keystrokes closer together than this collapse into one undo step, so undo
// takes back a run of typing rather than a letter — the way Chromium's own
// undo behaves.
const COALESCE_MS = 600
// ...but a run this long stops swallowing more, so undo can never wipe out
// minutes of uninterrupted typing in a single press.
const MAX_RUN_MS = 4000

/** Child indices leading from the editor root down to `node`. */
const pathTo = (root: Node, node: Node): number[] | null => {
  const path: number[] = []
  let cur: Node | null = node
  while (cur && cur !== root) {
    const parent: Node | null = cur.parentNode
    if (!parent) return null
    path.unshift(Array.prototype.indexOf.call(parent.childNodes, cur))
    cur = parent
  }
  return cur === root ? path : null
}

const nodeAt = (root: Node, path: number[]): Node | null => {
  let cur: Node = root
  for (const index of path) {
    const next: Node | undefined = cur.childNodes[index]
    if (!next) return null
    cur = next
  }
  return cur
}

const maxOffset = (node: Node) =>
  node.nodeType === Node.TEXT_NODE ? (node.textContent?.length ?? 0) : node.childNodes.length

export const captureSnapshot = (root: HTMLElement): Snapshot => {
  // Editing leaves behind empty and split-up text nodes that innerHTML drops on
  // the way out. Merging them first means the child indices recorded below still
  // point at the same places once the markup is parsed back in. normalize()
  // moves the live selection along with the nodes it merges, so the caret keeps
  // its place.
  root.normalize()

  const sel = window.getSelection()
  const inside =
    !!sel &&
    sel.rangeCount > 0 &&
    !!sel.anchorNode &&
    !!sel.focusNode &&
    root.contains(sel.anchorNode) &&
    root.contains(sel.focusNode)

  return {
    html: root.innerHTML,
    anchor: inside ? pathTo(root, sel.anchorNode as Node) : null,
    anchorOffset: inside ? sel.anchorOffset : 0,
    focus: inside ? pathTo(root, sel.focusNode as Node) : null,
    focusOffset: inside ? sel.focusOffset : 0,
  }
}

/**
 * Put the editor back the way the snapshot found it. The markup is restored
 * verbatim, so the child indices recorded alongside it still address the same
 * places and the caret lands where the user left it.
 */
export const restoreSnapshot = (root: HTMLElement, snapshot: Snapshot) => {
  if (root.innerHTML !== snapshot.html) root.innerHTML = snapshot.html

  if (!snapshot.anchor || !snapshot.focus) return
  const anchor = nodeAt(root, snapshot.anchor)
  const focus = nodeAt(root, snapshot.focus)
  const sel = window.getSelection()
  if (!anchor || !focus || !sel) return

  const range = document.createRange()
  try {
    range.setStart(anchor, Math.min(snapshot.anchorOffset, maxOffset(anchor)))
    range.setEnd(focus, Math.min(snapshot.focusOffset, maxOffset(focus)))
  } catch {
    // Backwards selection — the caret still ends up on the right line.
    range.selectNode(anchor)
    range.collapse(false)
  }
  sel.removeAllRanges()
  sel.addRange(range)
}

/**
 * How this change should group with the one before it. Runs of plain typing
 * (or of backspacing) merge; everything else — a space, a checkbox, a paste,
 * a format — is its own step.
 */
export const changeKind = (event: InputEvent): string | null => {
  switch (event.inputType) {
    case 'insertText':
    case 'insertCompositionText':
      return 'type'
    case 'deleteContentBackward':
    case 'deleteContentForward':
      return 'delete'
    default:
      return null
  }
}

export const useRichTextHistory = (ref: RefObject<HTMLDivElement | null>, emit: () => void) => {
  const state = useRef({
    stack: [] as Snapshot[],
    index: -1,
    lastAt: 0,
    runStartedAt: 0,
    lastKind: null as string | null,
  })

  /** Start over from whatever the editor is showing (a load from outside). */
  const reset = useCallback(() => {
    const root = ref.current
    if (!root) return
    state.current = {
      stack: [captureSnapshot(root)],
      index: 0,
      lastAt: 0,
      runStartedAt: 0,
      lastKind: null,
    }
  }, [ref])

  /** Note the editor's current state as a step that undo can come back to. */
  const record = useCallback(
    (kind: string | null) => {
      const root = ref.current
      if (!root) return
      const s = state.current
      if (s.index < 0) {
        reset()
        return
      }

      const snapshot = captureSnapshot(root)
      const top = s.stack[s.index]
      if (top.html === snapshot.html) {
        // Nothing changed — just keep the caret fresh, so undoing back to this
        // step later lands where the user actually is.
        s.stack[s.index] = snapshot
        return
      }

      const now = performance.now()
      const merge =
        kind !== null && kind === s.lastKind && now - s.lastAt < COALESCE_MS && now - s.runStartedAt < MAX_RUN_MS

      if (merge) {
        s.stack[s.index] = snapshot
      } else {
        // A new edit invalidates anything that was redoable.
        s.stack.length = s.index + 1
        s.stack.push(snapshot)
        if (s.stack.length > MAX_ENTRIES) s.stack.shift()
        s.index = s.stack.length - 1
        s.runStartedAt = now
      }
      s.lastAt = now
      s.lastKind = kind
    },
    [ref, reset],
  )

  const undo = useCallback(() => {
    const root = ref.current
    if (!root) return false
    // Fold in anything not recorded yet (a typing run still in progress)
    // before stepping back off it.
    record(null)

    const s = state.current
    if (s.index <= 0) return false
    s.index -= 1
    restoreSnapshot(root, s.stack[s.index])
    s.lastKind = null
    emit()
    return true
  }, [ref, record, emit])

  const redo = useCallback(() => {
    const root = ref.current
    const s = state.current
    if (!root || s.index < 0 || s.index >= s.stack.length - 1) return false
    s.index += 1
    restoreSnapshot(root, s.stack[s.index])
    s.lastKind = null
    emit()
    return true
  }, [ref, emit])

  return { reset, record, undo, redo }
}
