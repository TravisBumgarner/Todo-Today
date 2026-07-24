import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  IconButton,
  InputLabel,
  type SxProps,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { useCallback, useState } from "react";
import { v4 as uuid4 } from "uuid";

import RichTextEditor from "../components/RichTextEditor";
import TaskStatusSelector from "../components/TaskStatusSelector";
import { queries } from "../database";
import { activeModalSignal, selectedDateSignal } from "../signals";
import { SPACING } from "../styles/consts";
import { ETaskStatus, type TSubtask, type TTask } from "../types";
import Modal from "./Modal";

const AddTaskModal = () => {
  const [title, setTitle] = useState<string>("");
  const [status, setStatus] = useState<ETaskStatus>(ETaskStatus.NEW);
  const [details, setDetails] = useState<string>("");
  const [subtasks, setSubtasks] = useState<TSubtask[]>([]);
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [addToSelectedDate, setAddToSelectedDate] = useState<"yes" | "no">(
    "yes"
  );

  const handleCancel = useCallback(() => {
    activeModalSignal.value = null;
  }, []);

  const handleSubmit = async () => {
    const taskId = uuid4();
    // Don't silently drop a subtask the user typed but hasn't added yet.
    const pending = subtaskTitle.trim();
    const newTask: TTask = {
      title,
      status,
      id: taskId,
      details,
      subtasks: pending
        ? [...subtasks, { id: uuid4(), title: pending, checked: false }]
        : subtasks,
    };

    await queries.addTask(newTask);
    if (addToSelectedDate === "yes")
      await queries.addTaskToTodoList(selectedDateSignal.value, taskId);

    activeModalSignal.value = null;
  };

  const addSubtask = useCallback(() => {
    const trimmed = subtaskTitle.trim();
    if (!trimmed) return;
    setSubtasks((prev) => [
      ...prev,
      { id: uuid4(), title: trimmed, checked: false },
    ]);
    setSubtaskTitle("");
  }, [subtaskTitle]);

  const removeSubtask = useCallback((id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleAddToTodayChange = useCallback(
    (_event: React.MouseEvent<HTMLElement>, newValue: "yes" | "no") => {
      if (newValue === null) return;

      setAddToSelectedDate(newValue);
    },
    []
  );

  return (
    <Modal title="Add New Task" showModal={true}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: SPACING.SMALL.PX,
        }}
        onKeyDown={(e) => {
          // Cmd+Enter (macOS) / Ctrl+Enter (Windows/Linux) submits.
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && title.trim()) {
            e.preventDefault();
            void handleSubmit();
          }
        }}
      >
        <Box>
          <InputLabel sx={fieldLabelSx}>Task</InputLabel>
          <TextField
            fullWidth
            size="small"
            name="title"
            placeholder="What needs doing?"
            value={title}
            margin="none"
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </Box>

        <TaskStatusSelector
          taskStatus={status}
          handleStatusChangeCallback={setStatus}
          showLabel
        />

        <Box>
          <InputLabel sx={fieldLabelSx}>Details</InputLabel>
          <RichTextEditor
            value={details}
            placeholder="Add notes"
            onChange={setDetails}
          />
        </Box>

        <Box>
          <InputLabel sx={fieldLabelSx}>Subtasks</InputLabel>
          <Box sx={subtaskRowSx}>
            <TextField
              sx={{ flexGrow: 1 }}
              size="small"
              placeholder="Add a subtask"
              value={subtaskTitle}
              onChange={(event) => setSubtaskTitle(event.target.value)}
              onKeyDown={(e) => {
                // Enter (with or without Cmd/Ctrl) adds the subtask and stops
                // there — it must not bubble up to the modal's submit handler.
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.stopPropagation();
                  addSubtask();
                }
              }}
            />
            <Tooltip title="Add subtask">
              <span>
                <IconButton
                  size="small"
                  color={subtaskTitle.trim() ? "primary" : "info"}
                  disabled={!subtaskTitle.trim()}
                  onClick={addSubtask}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          {subtasks.length > 0 && (
            <Box sx={subtaskListSx}>
              {subtasks.map((subtask) => (
                <Box key={subtask.id} sx={subtaskItemSx}>
                  <Box component="span" sx={{ flex: 1, minWidth: 0 }}>
                    {subtask.title}
                  </Box>
                  <Tooltip title="Remove">
                    <IconButton
                      size="small"
                      onClick={() => removeSubtask(subtask.id)}
                    >
                      <DeleteOutlineIcon color="info" fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <InputLabel>Add to Today?</InputLabel>

          <ToggleButtonGroup
            value={addToSelectedDate}
            exclusive
            onChange={handleAddToTodayChange}
          >
            <ToggleButton size="small" value="no">
              <Tooltip title="Do not add to today">
                <CancelIcon color="info" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton size="small" value="yes">
              <Tooltip title="Add to today">
                <CheckCircleOutlineIcon color="info" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: SPACING.SMALL.PX,
          }}
        >
          <Button key="cancel" variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="contained"
            disabled={title.length === 0}
            key="save"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const fieldLabelSx: SxProps = {
  fontSize: "12px",
  marginBottom: "4px",
};

const subtaskRowSx: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: SPACING.TINY.PX,
};

const subtaskListSx: SxProps = {
  marginTop: SPACING.TINY.PX,
  display: "flex",
  flexDirection: "column",
  gap: "2px",
};

const subtaskItemSx: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: SPACING.TINY.PX,
  fontSize: "13px",
};

export default AddTaskModal;
