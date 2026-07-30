import { ChevronRight } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/ClearOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  type SxProps,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { useLiveQuery } from "dexie-react-hooks";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { goToDate } from "../actions";
import { richTextViewSx } from "../components/RichTextEditor";
import Tooltip from "../components/Tooltip";
import { queries } from "../database";
import type { TTaskHistoryEntry } from "../database/queries";
import { SPACING } from "../styles/consts";
import { DATE_ISO_DATE_MOMENT_STRING, ETaskStatus, type TDateISODate } from "../types";
import {
  countChecklist,
  htmlToPlainText,
  sanitizeDetailsHtml,
  sortStrings,
  taskStatusIcon,
  taskStatusLookup,
} from "../utilities";
import Modal from "./Modal";

// Statuses in the order they read as a lifecycle rather than alphabetically,
// so the filter row tells a story left to right.
const STATUS_ORDER = [
  ETaskStatus.NEW,
  ETaskStatus.IN_PROGRESS,
  ETaskStatus.BLOCKED,
  ETaskStatus.COMPLETED,
  ETaskStatus.CANCELED,
];

/** `days: 0` means "no lower bound"; UNSCHEDULED is the odd one out — it asks for
 * the tasks that never made it onto a list at all. */
const RANGES = [
  { value: "ALL", label: "All time", days: 0 },
  { value: "7", label: "Last 7 days", days: 7 },
  { value: "30", label: "Last 30 days", days: 30 },
  { value: "90", label: "Last 90 days", days: 90 },
  { value: "365", label: "Last year", days: 365 },
  { value: "UNSCHEDULED", label: "Never scheduled", days: 0 },
] as const;

type TRange = (typeof RANGES)[number]["value"];

const SORTS = [
  { value: "RECENT", label: "Newest first" },
  { value: "OLDEST", label: "Oldest first" },
  { value: "MOST_DAYS", label: "Most days" },
  { value: "TITLE", label: "Title" },
] as const;

type TSort = (typeof SORTS)[number]["value"];

const DEFAULT_RANGE: TRange = "ALL";
const DEFAULT_SORT: TSort = "RECENT";

/** Dates in the current year don't need the year spelled out. */
const shortDate = (date: TDateISODate) => {
  const parsed = moment(date, DATE_ISO_DATE_MOMENT_STRING);
  return parsed.year() === moment().year()
    ? parsed.format("MMM D")
    : parsed.format("MMM D, YYYY");
};

const HistoryModal = () => {
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<ETaskStatus[]>([]);
  const [range, setRange] = useState<TRange>(DEFAULT_RANGE);
  const [sort, setSort] = useState<TSort>(DEFAULT_SORT);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const history = useLiveQuery(() => queries.getTaskHistory());

  // The modal animates in, so focus on the next frame — focusing during the
  // first render loses out to MUI moving focus to the dialog root.
  useEffect(() => {
    const frame = requestAnimationFrame(() => searchRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  // Details are stored as HTML, so flatten them once per data change rather
  // than on every keystroke.
  const searchable = useMemo(
    () =>
      (history ?? []).map((entry) => ({
        entry,
        haystack: `${entry.task.title} ${htmlToPlainText(entry.task.details)}`.toLowerCase(),
      })),
    [history]
  );

  const results = useMemo(() => {
    const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
    const days = RANGES.find((option) => option.value === range)?.days ?? 0;
    // Ranges are inclusive of today, so "last 7 days" reaches back 6.
    const cutoff = days
      ? (moment()
          .subtract(days - 1, "days")
          .format(DATE_ISO_DATE_MOMENT_STRING) as TDateISODate)
      : null;

    const matched = searchable
      .filter(({ entry, haystack }) => {
        if (terms.some((term) => !haystack.includes(term))) return false;
        if (statuses.length > 0 && !statuses.includes(entry.task.status)) return false;

        if (range === "UNSCHEDULED") return entry.dates.length === 0;
        if (entry.dates.length === 0) return false;
        if (cutoff) return entry.dates[entry.dates.length - 1] >= cutoff;
        return true;
      })
      .map(({ entry }) => entry);

    const last = (entry: TTaskHistoryEntry) => entry.dates[entry.dates.length - 1] ?? "";

    return matched.sort((a, b) => {
      // Ties fall back to title so the order never wobbles between renders.
      const byTitle = sortStrings(a.task.title, b.task.title);
      if (sort === "TITLE") return byTitle;
      if (sort === "MOST_DAYS") return b.dates.length - a.dates.length || byTitle;

      if (last(a) === last(b)) return byTitle;
      const oldestFirst = last(a) < last(b) ? -1 : 1;
      return sort === "OLDEST" ? oldestFirst : -oldestFirst;
    });
  }, [searchable, search, statuses, range, sort]);

  const summary = useMemo(() => {
    const days = new Set<string>();
    let completed = 0;
    for (const entry of results) {
      for (const date of entry.dates) days.add(date);
      if (entry.task.status === ETaskStatus.COMPLETED) completed += 1;
    }
    return { tasks: results.length, completed, days: days.size };
  }, [results]);

  const isFiltered =
    search !== "" || statuses.length > 0 || range !== DEFAULT_RANGE || sort !== DEFAULT_SORT;

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatuses([]);
    setRange(DEFAULT_RANGE);
    setSort(DEFAULT_SORT);
    searchRef.current?.focus();
  }, []);

  const toggleExpanded = useCallback((taskId: string) => {
    setExpandedId((prev) => (prev === taskId ? null : taskId));
  }, []);

  return (
    <Modal title="History" showModal={true} styles={{ width: 700 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: SPACING.SMALL.PX }}>
        <Box sx={filterBarSx}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search titles and details…"
            value={search}
            inputRef={searchRef}
            spellCheck={false}
            onChange={(event) => setSearch(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch("")}>
                      <Tooltip title="Clear search">
                        <ClearIcon fontSize="small" />
                      </Tooltip>
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />

          <Box sx={{ display: "flex", gap: SPACING.SMALL.PX, flexWrap: "wrap" }}>
            <ToggleButtonGroup
              size="small"
              value={statuses}
              onChange={(_event, next: ETaskStatus[]) => setStatuses(next)}
              sx={statusGroupSx}
            >
              {STATUS_ORDER.map((status) => (
                <ToggleButton key={status} value={status} sx={{ px: SPACING.SMALL.PX }}>
                  <Tooltip title={taskStatusLookup[status]}>
                    {taskStatusIcon(status)}
                  </Tooltip>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Select
              size="small"
              value={range}
              onChange={(event) => setRange(event.target.value as TRange)}
              sx={{ minWidth: 150 }}
            >
              {RANGES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>

            <Select
              size="small"
              value={sort}
              disabled={range === "UNSCHEDULED"}
              onChange={(event) => setSort(event.target.value as TSort)}
              sx={{ minWidth: 130 }}
            >
              {SORTS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        <Box sx={summaryRowSx}>
          <Typography variant="body2">
            {history === undefined
              ? "Loading…"
              : [
                  `${summary.tasks} ${summary.tasks === 1 ? "task" : "tasks"}`,
                  summary.completed > 0 ? `${summary.completed} completed` : null,
                  summary.days > 0 ? `${summary.days} ${summary.days === 1 ? "day" : "days"}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
          </Typography>
          {isFiltered && (
            <Button variant="text" size="small" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </Box>

        <Box sx={listSx}>
          {history !== undefined && results.length === 0 && (
            <Typography variant="body2" sx={{ padding: SPACING.SMALL.PX }}>
              {searchable.length === 0
                ? "Nothing here yet. Days you work on tasks will show up in here."
                : "No tasks match those filters."}
            </Typography>
          )}
          {results.map((entry) => (
            <HistoryRow
              key={entry.task.id}
              entry={entry}
              expanded={expandedId === entry.task.id}
              onToggle={toggleExpanded}
            />
          ))}
        </Box>
      </Box>
    </Modal>
  );
};

interface HistoryRowProps {
  entry: TTaskHistoryEntry;
  expanded: boolean;
  onToggle: (taskId: string) => void;
}

const HistoryRow = ({ entry, expanded, onToggle }: HistoryRowProps) => {
  const { task, dates } = entry;
  const checklist = useMemo(() => countChecklist(task.details), [task.details]);
  const preview = useMemo(() => htmlToPlainText(task.details), [task.details]);
  const safeDetails = useMemo(
    () => (expanded ? sanitizeDetailsHtml(task.details) : ""),
    [expanded, task.details]
  );

  const first = dates[0];
  const last = dates[dates.length - 1];
  const span =
    dates.length === 0
      ? "Never scheduled"
      : dates.length === 1
        ? shortDate(first)
        : `${shortDate(first)} → ${shortDate(last)}`;

  const meta = [span, task.type === "recurring" ? "Recurring" : null]
    .filter(Boolean)
    .join(" · ");

  const struck = task.status === ETaskStatus.COMPLETED || task.status === ETaskStatus.CANCELED;

  return (
    <Box sx={rowSx}>
      <Box sx={{ display: "flex", alignItems: "center", gap: SPACING.SMALL.PX }}>
        <Tooltip title={taskStatusLookup[task.status]}>{taskStatusIcon(task.status)}</Tooltip>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            noWrap
            sx={{ fontWeight: 600, fontSize: "14px", textDecoration: struck ? "line-through" : "none" }}
          >
            {task.title || "Untitled task"}
          </Typography>
          <Typography variant="body2" noWrap>
            {meta}
          </Typography>
        </Box>

        {checklist.total > 0 && (
          <Tooltip title={`${checklist.checked} of ${checklist.total} checklist items done`}>
            <Typography variant="body2" sx={{ flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
              {checklist.checked}/{checklist.total}
            </Typography>
          </Tooltip>
        )}

        {dates.length > 0 && (
          <Tooltip title={`Last worked on ${moment(last, DATE_ISO_DATE_MOMENT_STRING).fromNow()}`}>
            <Box sx={dayCountSx}>
              {dates.length} {dates.length === 1 ? "day" : "days"}
            </Box>
          </Tooltip>
        )}

        <IconButton size="small" onClick={() => onToggle(task.id)}>
          <Tooltip title={expanded ? "Hide details" : "Show details"}>
            <ChevronRight
              color="info"
              fontSize="small"
              sx={{ transform: `rotate(${expanded ? "90deg" : "0deg"})` }}
            />
          </Tooltip>
        </IconButton>
      </Box>

      {expanded && (
        <Box sx={expandedSx}>
          {dates.length > 0 && (
            <Box>
              <Typography variant="body2" sx={labelSx}>
                Worked on
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: SPACING.TINY.PX }}>
                {[...dates].reverse().map((date) => (
                  <Tooltip key={date} title="Go to this day">
                    <Button variant="outlined" size="small" onClick={() => goToDate(date)}>
                      {shortDate(date)}
                    </Button>
                  </Tooltip>
                ))}
              </Box>
            </Box>
          )}

          <Box>
            <Typography variant="body2" sx={labelSx}>
              Details
            </Typography>
            {preview ? (
              // biome-ignore lint/security/noDangerouslySetInnerHtml: details are rich text, and sanitizeDetailsHtml has already reduced them to the handful of tags the editor writes
              <Box sx={richTextViewSx} dangerouslySetInnerHTML={{ __html: safeDetails }} />
            ) : (
              <Typography variant="body2">No details.</Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

const filterBarSx: SxProps<Theme> = (theme) => ({
  display: "flex",
  flexDirection: "column",
  gap: SPACING.SMALL.PX,
  padding: SPACING.SMALL.PX,
  borderRadius: `${theme.shape.borderRadius}px`,
  bgcolor: theme.app.panel,
  border: `1px solid ${theme.palette.divider}`,
});

// MuiToggleButton drops its borders app-wide (see themes.ts), which leaves the
// status filters looking like loose icons. Put the group's outline back.
const statusGroupSx: SxProps<Theme> = (theme) => ({
  bgcolor: "background.default",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: `${theme.shape.borderRadius}px`,
  "& .MuiToggleButton-root.Mui-selected": { bgcolor: theme.app.surface2 },
});

const summaryRowSx: SxProps = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minHeight: 26,
  paddingLeft: SPACING.TINY.PX,
};

const listSx: SxProps = {
  display: "flex",
  flexDirection: "column",
  gap: SPACING.TINY.PX,
  overflowY: "auto",
  // A fixed height rather than a max: the modal keeps the same size as you type
  // and filter instead of resizing under the pointer. Scales with the window so
  // it fits an 800x600 one and still uses a maximized one.
  height: "clamp(160px, calc(100vh - 280px), 560px)",
  flexShrink: 0,
};

const rowSx: SxProps<Theme> = (theme) => ({
  display: "flex",
  flexDirection: "column",
  padding: `${theme.app.density.rowPadY}px ${SPACING.SMALL.PX}`,
  borderRadius: `${theme.shape.borderRadius}px`,
  bgcolor: "background.paper",
  border: theme.app.border,
});

const dayCountSx: SxProps<Theme> = (theme) => ({
  flexShrink: 0,
  fontSize: "11px",
  fontFamily: theme.app.fontMeta,
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "999px",
  padding: "1px 8px",
  whiteSpace: "nowrap",
});

const expandedSx: SxProps<Theme> = (theme) => ({
  display: "flex",
  flexDirection: "column",
  gap: SPACING.SMALL.PX,
  marginTop: SPACING.TINY.PX,
  paddingTop: SPACING.TINY.PX,
  borderTop: `1px dashed ${theme.palette.divider}`,
});

const labelSx: SxProps<Theme> = (theme) => ({
  textTransform: theme.app.labelTransform,
  letterSpacing: theme.app.labelSpacing,
  fontSize: "10px",
  marginBottom: SPACING.TINY.PX,
  opacity: 0.75,
});

export default HistoryModal;
