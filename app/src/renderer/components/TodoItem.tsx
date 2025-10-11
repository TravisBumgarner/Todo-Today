import { Add, CheckBox, ChevronRight, Delete, Edit } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import {
  Box,
  Card,
  css,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
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
  const subtask = useLiveQuery(
    async () => await queries.getSubtask(taskId, subtaskId)
  );

  const handleSubtaskChange = useCallback(async () => {
    await queries.updateSubtask(taskId, subtaskId, {
      checked: !subtask?.checked,
    });
  }, [taskId, subtaskId, subtask]);

  const handleDeleteSubtask = useCallback(async () => {
    await queries.deleteSubtask(taskId, subtaskId);
  }, [taskId, subtaskId]);

  if (!subtask) return null;

  return (
    <Box sx={subtaskWrapperCSS}>
      <Typography>
        {subtask.checked ? <s>{subtask.title}</s> : subtask.title}
      </Typography>
      <Box>
        <IconButton onClick={handleDeleteSubtask}>
          <Delete color="info" fontSize="small" />
        </IconButton>
        {subtask.checked ? (
          <Tooltip title="Mark as incomplete">
            <IconButton onClick={handleSubtaskChange}>
              <CheckBox fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Mark as complete">
            <IconButton onClick={handleSubtaskChange}>
              <CheckIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

const subtaskWrapperCSS = css`
  display: flex;
  gap: ${SPACING.TINY.PX};
  justify-content: space-between;
  align-items: center;
`;

const TodoItem = ({ taskId }: TTodoItem) => {
  const [showContent, setShowContent] = useState(false);
  const [details, setDetails] = useState(""); // Undo doesn't work if synced directly to DB. Might be a more elegant solution, but for now, this works.
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [status, setStatus] = useState(ETaskStatus.NEW);
  const [subtaskIds, setSubtaskIds] = useState<string[]>([]);
  const [subtaskTitle, setSubtaskTitle] = useState("");

  useLiveQuery(() => {
    void database.tasks
      .where("id")
      .equals(taskId)
      .first()
      .then((task) => {
        setTempTitle(task?.title ?? "");
        setStatus(task?.status ?? ETaskStatus.NEW);
        setDetails(task?.details ?? "");
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
    setShowContent((prev) => !prev);
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

  const handleDetailsChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      void database.tasks
        .where("id")
        .equals(taskId)
        .modify({ details: event.target.value });
      setDetails(event.target.value);
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

  const handleEdit = useCallback(() => {
    setIsEditingTitle(true);
  }, []);

  const handleSaveTitle = useCallback(async () => {
    await database.tasks
      .where("id")
      .equals(taskId)
      .modify({ title: tempTitle });
    setIsEditingTitle(false);
  }, [taskId, tempTitle]);

  const handleCancel = useCallback(() => {
    setIsEditingTitle(false);
  }, []);

  const handleTempTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTempTitle(event.target.value);
    },
    []
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
    <Card sx={wrapperCSS}>
      <Box sx={headerCSS(showContent)}>
        <Box sx={leftHeaderCSS}>
          <Box>
            <TaskStatusSelector
              handleStatusChangeCallback={handleStatusChange}
              taskStatus={status}
              showLabel={false}
            />
          </Box>
          <Box sx={{ marginLeft: "1rem" }}>
            {isEditingTitle ? (
              <Box sx={textEditWrapperCSS}>
                <TextField
                  size="small"
                  fullWidth
                  value={tempTitle}
                  onChange={handleTempTitleChange}
                />
                <IconButton onClick={handleSaveTitle}>
                  <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={handleCancel}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Box sx={readonlyTextWrapperCSS}>
                <Typography sx={headerTextCSS} variant="h2">
                  {tempTitle}
                </Typography>
                <IconButton onClick={handleEdit} sx={textEditButtonCSS}>
                  <Edit fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={rightHeaderCSS}>
          <ToggleButton
            size="small"
            value="text"
            onChange={toggleContent}
            sx={{
              marginRight: "0.5rem",
              backgroundColor: "background.paper",
            }}
          >
            <Tooltip title="Show details">
              <ChevronRight
                color={showContent ? "primary" : "info"}
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
            placeholder="Notes"
            sx={detailsCSS}
            fullWidth
            rows={4}
            multiline
            value={details}
            onChange={handleDetailsChange}
          />
          <Box>
            <Box>
              <Box sx={subtaskInputWrapperCSS}>
                <TextField
                  size="small"
                  fullWidth
                  type="text"
                  placeholder="Subtask"
                  value={subtaskTitle}
                  onChange={handleSubtaskTitleChange}
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
    </Card>
  );
};

const subtaskListCSS = css``;

const subtaskInputWrapperCSS = css`
  display: flex;
  flex-direction: row;
  gap: ${SPACING.MEDIUM.PX};
  align-items: center;
`;

const contentWrapperCSS = css`
  display: flex;
  flex-direction: row;
  gap: ${SPACING.MEDIUM.PX};

  & > div {
    flex: 1;
  }
`;

const textEditButtonCSS = css`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
`;

const textEditWrapperCSS = css`
  display: flex;
  align-items: center;
`;

const readonlyTextWrapperCSS = css`
  display: flex;
  align-items: center;
  button {
    margin-left: ${SPACING.TINY.PX};
    display: none;
  }

  &:hover {
    button {
      display: block;
    }
  }
`;

const rightHeaderCSS = css`
  margin-left: ${SPACING.MEDIUM.PX};
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

const detailsCSS = {
  bgcolor: "background.paper",
};

const headerTextCSS = {
  fontSize: "1.5rem",
  color: "text.primary",
};

const leftHeaderCSS = css`
  display: flex;
  align-items: center;
`;

const wrapperCSS = {
  bgcolor: "background.paper",
  borderRadius: BORDER_RADIUS.ZERO.PX,
  padding: SPACING.SMALL.PX,
  marginBottom: SPACING.SMALL.PX,
};

export default TodoItem;
