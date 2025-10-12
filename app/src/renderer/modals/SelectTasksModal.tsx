import CheckIcon from "@mui/icons-material/Check";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo } from "react";

import { useSignals } from "@preact/signals-react/runtime";
import { useLiveQuery } from "dexie-react-hooks";
import { database, queries } from "../database";
import { activeModalSignal, selectedDateSignal } from "../signals";
import { SPACING } from "../styles/consts";
import { type TTask } from "../types";
import { sortStrings } from "../utilities";
import Modal, { MODAL_MAX_HEIGHT } from "./Modal";
import { ModalID } from "./RenderModal";

interface TaskProps {
  task: TTask;
  isSelected: boolean;
}

const Task = ({ task, isSelected }: TaskProps) => {
  useSignals();

  const handleSelect = useCallback(async () => {
    await queries.addTaskToTodoList(selectedDateSignal.value, task.id);
  }, [task.id]);

  const handleDeselect = useCallback(async () => {
    await queries.removeTaskFromTodoList(selectedDateSignal.value, task.id);
  }, [task.id]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: isSelected ? "action.selected" : undefined,
      }}
    >
      <Typography variant="body1" sx={{ paddingLeft: SPACING.SMALL.PX }}>
        {task.title}
      </Typography>
      <Tooltip
        placement="left"
        title={isSelected ? "Deselect Task" : "Select Task"}
      >
        <IconButton onClick={isSelected ? handleDeselect : handleSelect}>
          <CheckIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const SelectTasksModal = () => {
  useSignals();

  const tasks =
    useLiveQuery(async () => {
      return await queries.getActiveTasks();
    }) ?? {};

  // Ensure todoList exists on mount
  useEffect(() => {
    queries.getAndCreateIfNotExistsTodoList(selectedDateSignal.value);
  }, []);

  // Use useLiveQuery directly on the database table
  const todoList = useLiveQuery(() =>
    database.todoList.where("date").equals(selectedDateSignal.value).first()
  );

  const showAddNewTaskModal = useCallback(() => {
    activeModalSignal.value = { id: ModalID.ADD_TASK_MODAL };
  }, []);

  const handleClose = useCallback(() => {
    activeModalSignal.value = null;
  }, []);

  const content = useMemo(() => {
    if (!tasks || Object.keys(tasks).length === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: SPACING.MEDIUM.PX,
          }}
        >
          <Typography padding={`${SPACING.MEDIUM}px 0`} variant="body1">
            There are no Tasks to Work On
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={showAddNewTaskModal} variant="contained">
              Add New Task
            </Button>
          </Box>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <Box
          sx={{
            overflow: "auto",
            maxHeight: `${MODAL_MAX_HEIGHT - 200}px`,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: SPACING.SMALL.PX,
          }}
        >
          {Object.values(tasks)
            .sort((a, b) => sortStrings(a.title, b.title))
            .map((task) => (
              <Task
                key={task.id}
                task={task}
                isSelected={todoList?.taskIds.includes(task.id) ?? false}
              />
            ))}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="button"
              variant="contained"
              key="save"
              onClick={handleClose}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }, [tasks, todoList, showAddNewTaskModal, handleClose]);

  return (
    <Modal title="Select Tasks" showModal={true}>
      {content}
    </Modal>
  );
};

export default SelectTasksModal;
