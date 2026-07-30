import FormatBoldIcon from "@mui/icons-material/FormatBold";
import LinkIcon from "@mui/icons-material/Link";
import { Box, type SxProps } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import {
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// execCommand is deprecated on paper but the lightest way to get bold / lists /
// links in a contentEditable, and works fully in Electron's Chromium.
const exec = (command: string, arg?: string) =>
  document.execCommand(command, false, arg);

/**
 * Insert a checkbox (plus its padding space) at the caret and leave the caret
 * after it. Done with DOM APIs rather than execCommand("insertHTML") because
 * Chromium mis-places the caret when a contenteditable=false element starts a
 * block — it lands before the element, which reads as jumping to the line above.
 *
 * A checkbox is a non-editable span whose state lives in a data attribute, so
 * it serializes into innerHTML for free (no separate persistence needed).
 */
const insertCheckboxAtCaret = () => {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0);
  range.deleteContents();

  const span = document.createElement("span");
  span.className = "rte-check";
  span.setAttribute("contenteditable", "false");
  span.setAttribute("data-checked", "false");
  const pad = document.createTextNode(" ");

  // insertNode puts each node at the range start, so insert pad first.
  range.insertNode(pad);
  range.insertNode(span);

  const after = document.createRange();
  after.setStart(pad, 1);
  after.collapse(true);
  sel.removeAllRanges();
  sel.addRange(after);
};

const NBSP = / /g;
const isBlank = (s: string | null | undefined) => !(s ?? "").replace(NBSP, "").trim();

/** Text sitting after a checkbox on its own line (stops at a <br> or block end). */
const textAfterCheckbox = (check: Element) => {
  let text = "";
  let n = check.nextSibling;
  while (n && !(n.nodeType === Node.ELEMENT_NODE && (n as HTMLElement).tagName === "BR")) {
    text += n.textContent || "";
    n = n.nextSibling;
  }
  return text;
};

/** Drop a checkbox plus every blank/padding node that follows it. */
const removeCheckbox = (check: Element) => {
  let n = check.nextSibling;
  while (n && n.nodeType === Node.TEXT_NODE && isBlank(n.textContent)) {
    const next = n.nextSibling;
    n.parentNode?.removeChild(n);
    n = next;
  }
  check.parentNode?.removeChild(check);
};

const normalizeUrl = (url: string) => {
  const t = url.trim();
  if (!t) return "";
  return /^(https?:|mailto:)/i.test(t) ? t : `https://${t}`;
};

const RichTextEditor = ({ value, onChange, placeholder }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const [pop, setPop] = useState<{
    top: number;
    left: number;
    below: boolean;
  } | null>(null);
  const [linkMode, setLinkMode] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  // Seed the editor from stored value when it changes externally, but never
  // while the user is typing — that would jump the caret.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.activeElement !== el && el.innerHTML !== (value ?? "")) {
      el.innerHTML = value ?? "";
    }
  }, [value]);

  const save = useCallback(() => {
    onChange(ref.current?.innerHTML ?? "");
  }, [onChange]);

  // Show a floating toolbar above the current selection (if any).
  const refreshPopover = useCallback(() => {
    const el = ref.current;
    const sel = window.getSelection();
    if (
      !el ||
      !sel ||
      sel.rangeCount === 0 ||
      sel.isCollapsed ||
      !el.contains(sel.anchorNode)
    ) {
      if (!linkMode) setPop(null);
      return;
    }
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    // Keep the popover on screen: clamp horizontally (it's centered on the
    // selection) and flip below the selection when there's no room above.
    const margin = 8;
    const halfWidth = 120; // wide enough to cover the link-input state
    const left = Math.min(
      Math.max(rect.left + rect.width / 2, halfWidth + margin),
      window.innerWidth - halfWidth - margin
    );
    const below = rect.top < 46;
    setPop({ top: below ? rect.bottom + 6 : rect.top - 6, left, below });
  }, [linkMode]);

  /** The checkbox owning the line the caret is on, if any. */
  const checkboxOnCurrentLine = useCallback((): HTMLElement | null => {
    const root = ref.current;
    const sel = window.getSelection();
    if (!root || !sel?.anchorNode) return null;

    // When the caret is inside a block element, that block is the line.
    let block: HTMLElement | null =
      sel.anchorNode.nodeType === Node.TEXT_NODE
        ? sel.anchorNode.parentElement
        : (sel.anchorNode as HTMLElement);
    while (block && block !== root && block.parentElement !== root) {
      block = block.parentElement;
    }
    if (block && block !== root) {
      return block.querySelector(":scope > .rte-check");
    }

    // Unwrapped line (common for the first one): walk back to the previous <br>.
    let cur: Node | null =
      sel.anchorNode.nodeType === Node.TEXT_NODE
        ? sel.anchorNode
        : (sel.anchorNode.childNodes[sel.anchorOffset - 1] ?? sel.anchorNode);
    while (cur) {
      if (cur.nodeType === Node.ELEMENT_NODE) {
        const el = cur as HTMLElement;
        if (el.tagName === "BR") return null;
        if (el.classList?.contains("rte-check")) return el;
      }
      cur = cur.previousSibling;
    }
    return null;
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      // Bold — Cmd/Ctrl+B
      if ((e.metaKey || e.ctrlKey) && (e.key === "b" || e.key === "B")) {
        e.preventDefault();
        exec("bold");
        save();
        return;
      }
      // Indent / outdent for nested bullets
      if (e.key === "Tab") {
        e.preventDefault();
        exec(e.shiftKey ? "outdent" : "indent");
        save();
        return;
      }
      // Checklist: typing "[]" at the start of a line becomes a checkbox
      if (e.key === "]") {
        const sel = window.getSelection();
        const node = sel?.anchorNode;
        if (sel?.isCollapsed && node?.nodeType === Node.TEXT_NODE) {
          const before = node.textContent?.slice(0, sel.anchorOffset) ?? "";
          if (before === "[") {
            e.preventDefault();
            const range = sel.getRangeAt(0);
            range.setStart(node, sel.anchorOffset - 1);
            range.deleteContents();
            insertCheckboxAtCaret();
            save();
            return;
          }
        }
      }

      // Backspace with nothing but padding between the caret and its checkbox
      // removes the checkbox in one press. Measuring with a Range (rather than
      // walking siblings) keeps this working however Chromium happens to have
      // split the text nodes.
      if (e.key === "Backspace") {
        const sel = window.getSelection();
        const check = sel?.isCollapsed ? checkboxOnCurrentLine() : null;
        if (check && sel?.anchorNode) {
          try {
            const between = document.createRange();
            between.setStartAfter(check);
            between.setEnd(sel.anchorNode, sel.anchorOffset);
            if (isBlank(between.toString())) {
              e.preventDefault();
              // Clear the padding between the caret and the checkbox, then the
              // checkbox itself — otherwise a stray space is left behind.
              between.deleteContents();
              removeCheckbox(check);
              save();
              return;
            }
          } catch {
            // caret sits before the checkbox — let the browser handle it
          }
        }
      }

      // Enter on a checkbox line: continue the checklist, or exit it when the
      // line is empty (mirrors how bullet lists behave).
      if (e.key === "Enter" && !e.shiftKey) {
        const check = checkboxOnCurrentLine();
        if (check) {
          e.preventDefault();
          if (isBlank(textAfterCheckbox(check))) {
            const parent = check.parentNode;
            const index = parent
              ? Array.prototype.indexOf.call(parent.childNodes, check)
              : 0;
            removeCheckbox(check);
            if (parent) {
              const range = document.createRange();
              range.setStart(parent, Math.min(index, parent.childNodes.length));
              range.collapse(true);
              const s = window.getSelection();
              s?.removeAllRanges();
              s?.addRange(range);
            }
            save();
            return;
          }
          exec("insertParagraph");
          insertCheckboxAtCaret();
          save();
          return;
        }
      }

      // Markdown-style list: typing "- " at the start of a line
      if (e.key === " ") {
        const sel = window.getSelection();
        const node = sel?.anchorNode;
        if (sel?.isCollapsed && node?.nodeType === Node.TEXT_NODE) {
          const before = node.textContent?.slice(0, sel.anchorOffset) ?? "";
          if (before === "-") {
            e.preventDefault();
            const range = sel.getRangeAt(0);
            range.setStart(node, sel.anchorOffset - 1);
            range.deleteContents();
            exec("insertUnorderedList");
            save();
          }
        }
      }
    },
    [save, checkboxOnCurrentLine]
  );

  const boldSelection = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      exec("bold");
      save();
      refreshPopover();
    },
    [save, refreshPopover]
  );

  const startLink = useCallback((e: MouseEvent) => {
    e.preventDefault();
    const sel = window.getSelection();
    savedRange.current =
      sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
    setLinkUrl("");
    setLinkMode(true);
  }, []);

  const applyLink = useCallback(() => {
    const el = ref.current;
    const href = normalizeUrl(linkUrl);
    if (el && href && savedRange.current) {
      el.focus();
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRange.current);
      exec("createLink", href);
      save();
    }
    setLinkMode(false);
    setLinkUrl("");
    setPop(null);
  }, [linkUrl, save]);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      save();
      // Keep the popover open if focus moved into it (the link input/buttons).
      if (popRef.current?.contains(e.relatedTarget)) return;
      setPop(null);
      setLinkMode(false);
    },
    [save]
  );

  const handleClick = useCallback(
    (e: MouseEvent) => {
      // Toggle a checkbox
      const box = (e.target as HTMLElement).closest(".rte-check");
      if (box) {
        e.preventDefault();
        box.setAttribute(
          "data-checked",
          box.getAttribute("data-checked") === "true" ? "false" : "true"
        );
        save();
        return;
      }
      // Open http(s) links in the default browser (main handles the open).
      const anchor = (e.target as HTMLElement).closest("a");
      if (anchor?.href) {
        e.preventDefault();
        window.open(anchor.href, "_blank");
      }
    },
    [save]
  );

  return (
    <Box sx={{ position: "relative", flex: 1, minWidth: 0 }}>
      <Box
        component="div"
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder ?? "Add notes"}
        onInput={save}
        onBlur={handleBlur}
        onMouseUp={refreshPopover}
        onKeyUp={refreshPopover}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        sx={editorSx}
      />

      {pop ? (
        <Box
          ref={popRef}
          onMouseDown={(e) => {
            // keep the editor selection when clicking the buttons
            if ((e.target as HTMLElement).tagName !== "INPUT") e.preventDefault();
          }}
          style={{
            top: pop.top,
            left: pop.left,
            transform: `translate(-50%, ${pop.below ? "0" : "-100%"})`,
          }}
          sx={popoverSx}
        >
          {linkMode ? (
            <Box
              component="input"
              autoFocus
              placeholder="Paste link, press Enter"
              value={linkUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLinkUrl(e.target.value)
              }
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") applyLink();
                if (e.key === "Escape") {
                  setLinkMode(false);
                  setPop(null);
                }
              }}
              sx={linkInputSx}
            />
          ) : (
            <>
              <Box component="button" type="button" onMouseDown={boldSelection} sx={popBtnSx}>
                <FormatBoldIcon fontSize="small" />
              </Box>
              <Box component="button" type="button" onMouseDown={startLink} sx={popBtnSx}>
                <LinkIcon fontSize="small" />
              </Box>
            </>
          )}
        </Box>
      ) : null}
    </Box>
  );
};

const baseEditor = (theme: Theme, interactive = true) => ({
  fontSize: "13px",
  lineHeight: 1.4,
  cursor: interactive ? "text" : "default",
  outline: "none",
  overflowWrap: "anywhere" as const,
  "&:empty::before": {
    content: "attr(data-placeholder)",
    color: theme.palette.text.secondary,
    pointerEvents: "none",
  },
  "& a": {
    color: theme.palette.primary.main,
    textDecoration: "underline",
    cursor: "pointer",
  },
  "& ul, & ol": { margin: "3px 0", paddingLeft: "18px" },
  "& li": { marginBottom: "1px" },
  "& b, & strong": { fontWeight: 700 },

  // --- "[]" checkboxes ---
  "& .rte-check": {
    display: "inline-block",
    position: "relative",
    width: "13px",
    height: "13px",
    marginRight: "7px",
    verticalAlign: "-2px",
    borderRadius: "3px",
    border: `1.6px solid ${theme.palette.text.disabled}`,
    cursor: interactive ? "pointer" : "default",
    userSelect: "none",
  },
  "& .rte-check[data-checked='true']": {
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
  "& .rte-check[data-checked='true']::after": {
    content: '"✓"',
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "9px",
    fontWeight: 800,
    lineHeight: 1,
    color: theme.palette.primary.contrastText,
  },
  // strike the whole line once its checkbox is ticked
  "& *:has(> .rte-check[data-checked='true'])": {
    textDecoration: "line-through",
    color: theme.palette.text.secondary,
  },
});

/**
 * The editor's own typography and checkbox rules, minus the editing affordances
 * — for read-only renders of a task's details elsewhere (the history view), so
 * checklists and links look the same there as they do in the editor.
 */
export const richTextViewSx: SxProps<Theme> = (theme) => baseEditor(theme, false);

const editorSx: SxProps<Theme> = (theme) => ({
  ...baseEditor(theme),
  minHeight: "26px",
  padding: "4px 8px",
  borderRadius: `${theme.shape.borderRadius}px`,
  border: `1px solid ${theme.palette.divider}`,
  "&:focus-within, &:focus": { borderColor: theme.palette.primary.main },
});

const popoverSx: SxProps<Theme> = (theme) => ({
  position: "fixed",
  zIndex: 1400,
  display: "flex",
  alignItems: "center",
  gap: "2px",
  padding: "3px",
  borderRadius: "8px",
  bgcolor: theme.palette.mode === "dark" ? "#000" : "#1c2126",
  boxShadow: "0 6px 20px rgba(0,0,0,.35)",
});

const popBtnSx: SxProps = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 26,
  height: 26,
  border: 0,
  borderRadius: "6px",
  cursor: "pointer",
  background: "transparent",
  color: "#e6edf2",
  "&:hover": { background: "rgba(255,255,255,.14)" },
};

const linkInputSx: SxProps = {
  border: 0,
  outline: "none",
  background: "transparent",
  color: "#e6edf2",
  fontSize: "12.5px",
  padding: "3px 6px",
  width: 190,
  "&::placeholder": { color: "rgba(230,237,242,.5)" },
};

export default RichTextEditor;
