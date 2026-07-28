import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Box,
  Button,
  InputLabel,
  type SxProps,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid4 } from "uuid";
import Tooltip from "../components/Tooltip";

import RichTextEditor from "../components/RichTextEditor";
import TaskStatusSelector from "../components/TaskStatusSelector";
import { queries } from "../database";
import { activeModalSignal, selectedDateSignal } from "../signals";
import { SPACING } from "../styles/consts";
import { ETaskStatus, type TTask } from "../types";
import Modal from "./Modal";

const NewTaskModal = () => {
  const [title, setTitle] = useState<string>("");
  const [status, setStatus] = useState<ETaskStatus>(ETaskStatus.NEW);
  const [details, setDetails] = useState<string>("");
  const [addToSelectedDate, setAddToSelectedDate] = useState<"yes" | "no">(
    "yes"
  );
  const titleRef = useRef<HTMLInputElement>(null);

  // The modal animates in, so focus on the next frame — focusing during the
  // first render loses out to MUI moving focus to the dialog root.
  useEffect(() => {
    const frame = requestAnimationFrame(() => titleRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleCancel = useCallback(() => {
    activeModalSignal.value = null;
  }, []);

  const handleSubmit = async () => {
    const taskId = uuid4();
    const newTask: TTask = {
      title,
      status,
      id: taskId,
      details,
      type: "regular",
    };

    await queries.addTask(newTask);
    if (addToSelectedDate === "yes")
      await queries.addTaskToTodoList(selectedDateSignal.value, taskId);

    activeModalSignal.value = null;
  };

  const handleAddToTodayChange = useCallback(
    (_event: React.MouseEvent<HTMLElement>, newValue: "yes" | "no") => {
      if (newValue === null) return;

      setAddToSelectedDate(newValue);
    },
    []
  );

  return (
    <Modal title="New Task" showModal={true}>
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
            inputRef={titleRef}
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
            placeholder="Add notes — type [] for a checklist item"
            onChange={setDetails}
          />
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

export default NewTaskModal;
