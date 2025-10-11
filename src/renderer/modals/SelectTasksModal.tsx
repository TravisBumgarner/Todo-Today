import CheckIcon from "@mui/icons-material/Check";
import { Box, Button, IconButton, Typography, css } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useSignals } from "@preact/signals-react/runtime";
import { queries } from "../database";
import { useLiveQuery } from "dexie-react-hooks";
import { SPACING } from "../Theme";
import { type TTask, type TTodoList } from "../types";
import { sortStrings } from "../utilities";
import { activeModalSignal, selectedDateSignal } from "../signals";
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
    <Box sx={tasksHeaderCSS}>
      <Typography variant="body1">{task.title}</Typography>
      <Box sx={rightHeaderCSS}>
        <IconButton
          color={isSelected ? "primary" : "info"}
          onClick={isSelected ? handleDeselect : handleSelect}
        >
          <CheckIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

const rightHeaderCSS = css`
  margin-left: 1rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const tasksHeaderCSS = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SelectTasksModal = () => {
  useSignals();
  const [tasks, setTasks] = useState<Record<string, TTask>>({});
  const [todoList, setTodoList] = useState<TTodoList | null>(null);

  useLiveQuery(async () => {
    const tasks = await queries.getActiveTasks();
    setTasks(tasks);
  }, []);

  useEffect(() => {
    const fetchTodoList = async () => {
      const todoList = await queries.getAndCreateIfNotExistsTodoList(
        selectedDateSignal.value
      );
      setTodoList(todoList);
    };
    fetchTodoList();
  }, []);

  const showAddNewTaskModal = useCallback(() => {
    activeModalSignal.value = { id: ModalID.ADD_TASK_MODAL };
  }, []);

  const handleClose = useCallback(() => {
    activeModalSignal.value = null;
  }, []);

  const content = useMemo(() => {
    if (!tasks || Object.keys(tasks).length === 0) {
      return (
        <Box>
          <Typography padding={`${SPACING.MEDIUM}px 0`} variant="body1">
            There are no Tasks to Work On
          </Typography>
          <Button onClick={showAddNewTaskModal} fullWidth variant="contained">
            Add New Task
          </Button>
        </Box>
      );
    }

    return (
      <Box sx={wrapperCSS}>
        <Box sx={scrollWrapperCSS}>
          {Object.values(tasks)
            .sort((a, b) => sortStrings(a.title, b.title))
            .map((task) => (
              <Task
                key={task.id}
                task={task}
                isSelected={todoList?.taskIds.includes(task.id) ?? false}
              />
            ))}
          <Button
            fullWidth
            type="button"
            variant="contained"
            key="save"
            onClick={handleClose}
          >
            Done
          </Button>
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

const scrollWrapperCSS = css`
  overflow: auto;
  max-height: ${MODAL_MAX_HEIGHT - 200}px;
  width: 100%;
`;

const wrapperCSS = css`
  height: 100%;
  width: 100%;
`;

export default SelectTasksModal;
