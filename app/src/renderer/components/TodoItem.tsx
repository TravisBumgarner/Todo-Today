import { Add, CheckBox, ChevronRight, Delete } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import { Box, css, IconButton, TextField, Tooltip } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import { useLiveQuery } from "dexie-react-hooks";
import { type ChangeEvent, useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { database, queries } from "../database";
import { selectedDateSignal } from "../signals";
import { BORDER_RADIUS, SPACING } from "../styles/consts";
import { ETaskStatus } from "../types";
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

  const handleTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setLocalTitle(event.target.value);
    },
    []
  );

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

  const handleSaveTitle = useCallback(async () => {
    if (localTitle.trim().length === 0) return;
    await queries.updateSubtask(taskId, subtaskId, { title: localTitle });
  }, [taskId, subtaskId, localTitle]);

  const handleDeleteSubtask = useCallback(async () => {
    await queries.deleteSubtask(taskId, subtaskId);
  }, [taskId, subtaskId]);

  if (!subtask) return null;

  return (
    <Box sx={subtaskWrapperCSS}>
      <TextField
        onChange={handleTitleChange}
        onBlur={handleSaveTitle}
        value={localTitle}
        sx={{
          textDecoration: subtask.checked ? "line-through" : "none",
          "& .MuiOutlinedInput-root": {
            padding: 0,
            "& fieldset": {
              border: "none",
            },
            "& input": {
              padding: 0,
            },
          },
        }}
      />
      <Box sx={{ display: "flex" }}>
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
        <IconButton size="small" onClick={handleDeleteSubtask}>
          <Delete color="info" fontSize="small" />
        </IconButton>
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

  const handleDetailsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setLocalDetails(event.target.value);
    },
    []
  );

  const handleSaveDetails = useCallback(async () => {
    await database.tasks
      .where("id")
      .equals(taskId)
      .modify({ details: localDetails });
  }, [taskId, localDetails]);

  const handleAddSubtask = useCallback(async () => {
    await queries.insertSubtask(taskId, {
      id: uuidv4(),
      title: subtaskTitle,
      checked: false,
    });
    setSubtaskTitle("");
  }, [taskId, subtaskTitle]);

  return (
    <Box sx={wrapperCSS}>
      <Box sx={headerCSS(showContent)}>
        <Box sx={leftHeaderCSS}>
          <Box>
            <TaskStatusSelector
              handleStatusChangeCallback={handleStatusChange}
              taskStatus={status}
              showLabel={false}
            />
          </Box>
          <TextField
            size="small"
            fullWidth
            placeholder="Task"
            value={localTitle}
            onBlur={handleSaveTitle}
            onChange={handleTitleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                padding: 0,
                "& fieldset": {
                  border: "none",
                },
                "& input": {
                  fontSize: "24px",
                  padding: 0,
                },
              },
            }}
          />
        </Box>
        <Box sx={rightHeaderCSS}>
          <ToggleButton
            size="small"
            value="text"
            onChange={toggleContent}
            sx={{
              backgroundColor: "background.paper",
            }}
          >
            <Tooltip title={showContent ? "Hide Details" : "Show details"}>
              <ChevronRight
                color="info"
                fontSize="small"
                sx={{ transform: `rotate(${showContent ? "90deg" : "0deg"})` }}
              />
            </Tooltip>
          </ToggleButton>

          <Tooltip title="Remove from today">
            <IconButton
              onClick={handleRemoveFromToday}
              sx={{ marginLeft: "0.5rem" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {showContent && (
        <Box sx={contentWrapperCSS}>
          <TextField
            placeholder="Add notes"
            fullWidth
            multiline
            size="small"
            value={localDetails}
            onBlur={handleSaveDetails}
            onChange={handleDetailsChange}
          />
          <Box>
            <Box>
              <Box sx={subtaskInputWrapperCSS}>
                <TextField
                  size="small"
                  fullWidth
                  type="text"
                  placeholder="Add subtask"
                  value={subtaskTitle}
                  onChange={handleSubtaskTitleChange}
                  onKeyDown={(e) => {
                    console.log("e.key:", e.key);
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                />
                <Tooltip title="Add subtask">
                  <span>
                    <IconButton
                      color={subtaskTitle.length === 0 ? "info" : "primary"}
                      disabled={subtaskTitle.length === 0}
                      onClick={handleAddSubtask}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Box>
            <Box sx={subtaskListCSS}>
              {subtaskIds.map((subtaskId) => (
                <Subtask
                  key={subtaskId}
                  taskId={taskId}
                  subtaskId={subtaskId}
                />
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const subtaskListCSS = css``;

const subtaskInputWrapperCSS = css`
  display: flex;
  flex-direction: row;
  gap: ${SPACING.TINY.PX};
  align-items: center;
`;

const contentWrapperCSS = css`
  display: flex;
  flex-direction: row;
  gap: ${SPACING.SMALL.PX};

  & > div {
    flex: 1;
  }
`;

const rightHeaderCSS = css`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const headerCSS = (showDetails: boolean) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${showDetails ? SPACING.SMALL.PX : "0"};
`;

const leftHeaderCSS = css`
  display: flex;
  flex-grow: 1;
  align-items: center;
`;

const wrapperCSS = {
  bgcolor: "background.paper",
  borderRadius: BORDER_RADIUS.ZERO.PX,
  padding: SPACING.SMALL.PX,
  marginBottom: SPACING.SMALL.PX,
};

export default TodoItem;
