import {
  Add,
  CheckBox,
  ChevronRight,
  DeleteOutline,
  DragIndicator,
} from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import { Box, css, IconButton, TextField, Tooltip } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import { type Theme, useTheme } from "@mui/material/styles";
import { useLiveQuery } from "dexie-react-hooks";
import { type ChangeEvent, useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { database, queries } from "../database";
import { useDebouncedPersist } from "../hooks/useDebouncedPersist";
import { selectedDateSignal } from "../signals";
import { SPACING } from "../styles/consts";
import { ETaskStatus } from "../types";
import RichTextEditor from "./RichTextEditor";
import TaskStatusSelector from "./TaskStatusSelector";


export interface TTodoItem {
  taskId: string;
}

const Subtask = ({
  taskId,
  subtaskId,
}: {
  taskId: string;
  subtaskId: string;
}) => {
  const [localTitle, setLocalTitle] = useState("");

  const subtask = useLiveQuery(async () => {
    const fetchedSubtask = await queries.getSubtask(taskId, subtaskId);
    setLocalTitle(fetchedSubtask?.title ?? "");
    return fetchedSubtask;
  });

  const handleSubtaskChange = useCallback(async () => {
    await queries.updateSubtask(taskId, subtaskId, {
      checked: !subtask?.checked,
    });
  }, [taskId, subtaskId, subtask]);

  const persistTitle = useDebouncedPersist<string>(
    useCallback(
      (html: string) => {
        void queries.updateSubtask(taskId, subtaskId, { title: html });
      },
      [taskId, subtaskId]
    )
  );

  const handleTitleSave = useCallback(
    (html: string) => {
      setLocalTitle(html);
      persistTitle(html);
    },
    [persistTitle]
  );

  const handleDeleteSubtask = useCallback(async () => {
    await queries.deleteSubtask(taskId, subtaskId);
  }, [taskId, subtaskId]);

  if (!subtask) return null;

  return (
    <Box sx={subtaskWrapperCSS}>
      {subtask.checked ? (
        <Tooltip title="Mark as incomplete">
          <IconButton size="small" onClick={handleSubtaskChange}>
            <CheckBox fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Mark as complete">
          <IconButton size="small" onClick={handleSubtaskChange}>
            <CheckIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          ...(subtask.checked
            ? {
                "& [contenteditable]": {
                  textDecoration: "line-through",
                  color: "text.secondary",
                },
              }
            : {}),
        }}
      >
        <RichTextEditor
          plain
          value={localTitle}
          placeholder="Subtask"
          onChange={handleTitleSave}
        />
      </Box>
      <Box sx={{ display: "flex" }}>
        <Tooltip title="Delete subtask">
          <IconButton size="small" onClick={handleDeleteSubtask}>
            <DeleteOutline color="info" fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

const subtaskWrapperCSS = css`
  display: flex;
  gap: ${SPACING.TINY.PX};
  justify-content: space-between;
  align-items: center;
  margin-top: ${SPACING.TINY.PX};
`;

const TodoItem = ({ taskId }: TTodoItem) => {
  const theme = useTheme();
  const density = theme.app.density;
  const [showContent, setShowContent] = useState(false);
  const [localDetails, setLocalDetails] = useState("");
  const [localTitle, setLocalTitle] = useState("");
  const [status, setStatus] = useState(ETaskStatus.NEW);
  const [subtaskIds, setSubtaskIds] = useState<string[]>([]);
  const [subtaskTitle, setSubtaskTitle] = useState("");

  useLiveQuery(() => {
    void database.tasks
      .where("id")
      .equals(taskId)
      .first()
      .then((task) => {
        setLocalTitle(task?.title ?? "");
        setStatus(task?.status ?? ETaskStatus.NEW);
        setLocalDetails(task?.details ?? "");
        const hasTasksOrDetails =
          !!task?.details || (task?.subtasks?.length ?? 0) > 0;
        const isActive = [
          ETaskStatus.IN_PROGRESS,
          ETaskStatus.NEW,
          ETaskStatus.BLOCKED,
        ].includes(task?.status ?? ETaskStatus.NEW);
        setShowContent(hasTasksOrDetails && isActive);
        setSubtaskIds(task?.subtasks?.map((subtask) => subtask.id) ?? []);
      });
  });

  const toggleContent = useCallback(() => {
    setShowContent((prev) => {
      return !prev;
    });
  }, []);

  const handleSubtaskTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSubtaskTitle(event.target.value);
    },
    []
  );

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

  const handleAddSubtask = useCallback(async () => {
    await queries.insertSubtask(taskId, {
      id: uuidv4(),
      title: subtaskTitle,
      checked: false,
    });
    setSubtaskTitle("");
  }, [taskId, subtaskTitle]);

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
              placeholder="Add notes"
              onChange={handleDetailsSave}
            />
            <Box>
              <Box sx={subtaskInputWrapperCSS}>
                <TextField
                  sx={{ flexGrow: 1 }}
                  size="small"
                  type="text"
                  placeholder="Add a subtask"
                  value={subtaskTitle}
                  onChange={handleSubtaskTitleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                />
                <Tooltip title="Add subtask">
                  <span>
                    <IconButton
                      size="small"
                      sx={{ cursor: "pointer" }}
                      color={subtaskTitle.length === 0 ? "info" : "primary"}
                      disabled={subtaskTitle.length === 0}
                      onClick={handleAddSubtask}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
              {subtaskIds.length > 0 && (
                <Box sx={{ marginTop: SPACING.TINY.PX }}>
                  {subtaskIds.map((subtaskId) => (
                    <Subtask
                      key={subtaskId}
                      taskId={taskId}
                      subtaskId={subtaskId}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        )}
    </Box>
  );
};

const subtaskInputWrapperCSS = css`
      display: flex;
      flex-direction: row;
      gap: ${SPACING.TINY.PX};
      align-items: center;
      `;

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
