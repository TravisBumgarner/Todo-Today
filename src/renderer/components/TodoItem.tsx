import { ChevronRight, DragIndicator } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import { Box, IconButton, type SxProps, TextField, Typography } from "@mui/material";
import Tooltip from "./Tooltip";
import ToggleButton from "@mui/material/ToggleButton";
import { type Theme, useTheme } from "@mui/material/styles";
import { useLiveQuery } from "dexie-react-hooks";
import { type ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { database } from "../database";
import { useDebouncedPersist } from "../hooks/useDebouncedPersist";
import { selectedDateSignal } from "../signals";
import { SPACING } from "../styles/consts";
import { ETaskStatus } from "../types";
import { countChecklist } from "../utilities";
import RichTextEditor from "./RichTextEditor";
import TaskStatusSelector from "./TaskStatusSelector";

export interface TTodoItem {
  taskId: string;
}

const TodoItem = ({ taskId }: TTodoItem) => {
  const theme = useTheme();
  const density = theme.app.density;
  const [showContent, setShowContent] = useState(false);
  const [localDetails, setLocalDetails] = useState("");
  const [localTitle, setLocalTitle] = useState("");
  const [status, setStatus] = useState(ETaskStatus.NEW);
  // Whether a task starts expanded is decided once, on load. Re-deciding it on
  // every write would slam the details shut the moment you backspace the last
  // character out of them.
  const hasLoaded = useRef(false);

  useLiveQuery(() => {
    void database.tasks
      .where("id")
      .equals(taskId)
      .first()
      .then((task) => {
        setLocalTitle(task?.title ?? "");
        setStatus(task?.status ?? ETaskStatus.NEW);
        setLocalDetails(task?.details ?? "");

        if (hasLoaded.current) return;
        hasLoaded.current = true;

        const isActive = [
          ETaskStatus.IN_PROGRESS,
          ETaskStatus.NEW,
          ETaskStatus.BLOCKED,
        ].includes(task?.status ?? ETaskStatus.NEW);
        setShowContent(!!task?.details && isActive);
      });
  });

  const checklist = useMemo(() => countChecklist(localDetails), [localDetails]);

  const toggleContent = useCallback(() => {
    setShowContent((prev) => {
      return !prev;
    });
  }, []);

  const handleStatusChange = useCallback(
    async (status: ETaskStatus) => {
      if (status === null) return;
      await database.tasks.where("id").equals(taskId).modify({ status });
    },
    [taskId]
  );

  const handleRemoveFromToday = useCallback(async () => {
    const todoList = await database.todoList
      .where("date")
      .equals(selectedDateSignal.value)
      .first();
    await database.todoList
      .where("date")
      .equals(selectedDateSignal.value)
      .modify({
        taskIds: todoList?.taskIds.filter((id) => id !== taskId) ?? [],
      });
  }, [taskId]);

  const handleTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setLocalTitle(event.target.value);
    },
    []
  );

  const handleSaveTitle = useCallback(async () => {
    await database.tasks
      .where("id")
      .equals(taskId)
      .modify({ title: localTitle });
  }, [taskId, localTitle]);

  const persistDetails = useDebouncedPersist<string>(
    useCallback(
      (html: string) => {
        void database.tasks.where("id").equals(taskId).modify({ details: html });
      },
      [taskId]
    )
  );

  const handleDetailsSave = useCallback(
    (html: string) => {
      setLocalDetails(html);
      persistDetails(html);
    },
    [persistDetails]
  );

  return (
    <Box sx={cardSx(theme, status)}>
      <Box sx={headerRowSx}>
        <DragIndicator sx={dragHandleSx} />
        <TaskStatusSelector
          handleStatusChangeCallback={handleStatusChange}
          taskStatus={status}
          showLabel={false}
        />
        <TextField
          size="small"
          placeholder="Task"
          value={localTitle}
          onBlur={handleSaveTitle}
          onChange={handleTitleChange}
          sx={{
            flex: 1,
            minWidth: 0,
            "& .MuiOutlinedInput-root": {
              padding: 0,
              pointerEvents: "auto",
              "& fieldset": { border: "none" },
              "& input": {
                fontSize: `${density.titleSize}px`,
                fontWeight: 600,
                textDecoration:
                  status === ETaskStatus.COMPLETED ||
                  status === ETaskStatus.CANCELED
                    ? "line-through"
                    : "none",
                pointerEvents: "auto",
                padding: 0,
              },
            },
          }}
        />
        {!showContent && checklist.total > 0 && (
          <ChecklistProgress
            checked={checklist.checked}
            total={checklist.total}
          />
        )}
        <ToggleButton
          size="small"
          value="text"
          onChange={toggleContent}
          sx={{ backgroundColor: "transparent" }}
        >
          <Tooltip title={showContent ? "Hide details" : "Show details"}>
            <ChevronRight
              color="info"
              fontSize="small"
              sx={{ transform: `rotate(${showContent ? "90deg" : "0deg"})` }}
            />
          </Tooltip>
        </ToggleButton>
        <Tooltip title="Remove from today">
          <IconButton size="small" onClick={handleRemoveFromToday}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {showContent && (
        <Box sx={contentWrapperSx(theme)}>
          <RichTextEditor
            value={localDetails}
            placeholder="Add notes — type [] for a checklist item"
            onChange={handleDetailsSave}
          />
        </Box>
      )}
    </Box>
  );
};

/**
 * Collapsed-view summary of the checklist buried in a task's details, so you
 * can see progress without expanding the card.
 */
const ChecklistProgress = ({
  checked,
  total,
}: {
  checked: number;
  total: number;
}) => {
  const done = checked === total;

  return (
    <Tooltip title={`${checked} of ${total} checklist items done`}>
      <Box sx={progressWrapperSx}>
        <Box sx={progressTrackSx}>
          <Box sx={progressFillSx(checked / total, done)} />
        </Box>
        <Typography sx={progressLabelSx(done)}>
          {checked}/{total}
        </Typography>
      </Box>
    </Tooltip>
  );
};

const progressWrapperSx: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flexShrink: 0,
  paddingRight: "2px",
};

const progressTrackSx: SxProps<Theme> = (theme) => ({
  width: 44,
  height: 4,
  borderRadius: "2px",
  overflow: "hidden",
  backgroundColor: theme.palette.action.disabledBackground,
});

const progressFillSx =
  (ratio: number, done: boolean): SxProps<Theme> =>
  (theme) => ({
    width: `${Math.round(ratio * 100)}%`,
    height: "100%",
    borderRadius: "2px",
    transition: "width 160ms ease-out",
    backgroundColor: done
      ? theme.app.statusColors[ETaskStatus.COMPLETED]
      : theme.palette.primary.main,
  });

const progressLabelSx =
  (done: boolean): SxProps<Theme> =>
  (theme) => ({
    fontSize: "11px",
    fontVariantNumeric: "tabular-nums",
    lineHeight: 1,
    color: done
      ? theme.app.statusColors[ETaskStatus.COMPLETED]
      : theme.palette.text.secondary,
  });

const headerRowSx = {
  display: "flex",
  alignItems: "center",
  gap: SPACING.TINY.PX,
};

const dragHandleSx = {
  cursor: "grab",
  color: "text.secondary",
  opacity: 0.4,
  fontSize: "18px",
  flexShrink: 0,
  "&:active": { cursor: "grabbing" },
};

// Status Rail: a colored left border encodes status; the rest of the card
// stays neutral.
const cardSx = (theme: Theme, status: ETaskStatus) => ({
  display: "flex",
  flexDirection: "column" as const,
  bgcolor: "background.paper",
  border: theme.app.border,
  borderLeft: `3px solid ${theme.app.statusColors[status]}`,
  borderRadius: `${theme.shape.borderRadius}px`,
  boxShadow: theme.app.cardShadow,
  padding: `${theme.app.density.rowPadY}px ${SPACING.SMALL.PX}`,
  marginBottom: `${theme.app.density.itemGap}px`,
  cursor: "grab",
  "& input, & textarea, & [contenteditable]": { cursor: "text" },
  "&:active": { cursor: "grabbing" },
});

const contentWrapperSx = (theme: Theme) => ({
  display: "flex",
  flexDirection: "column" as const,
  gap: SPACING.TINY.PX,
  marginTop: SPACING.TINY.PX,
  paddingTop: SPACING.TINY.PX,
  borderTop: `1px dashed ${theme.palette.divider}`,
});

export default TodoItem;
