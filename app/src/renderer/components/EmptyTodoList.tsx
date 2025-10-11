import { Box, Button, ButtonGroup, css, Typography } from "@mui/material";
import { useCallback } from "react";

import { useSignals } from "@preact/signals-react/runtime";
import { queries } from "../database";
import { ModalID } from "../modals";
import {
  activeModalSignal,
  messageSignal,
  selectedDateSignal,
} from "../signals";

const EmptyTodoList = () => {
  useSignals();
  const getPreviousDatesTasks = useCallback(async () => {
    const previousDayActiveTasks = await queries.getPreviousDayActiveTasks(
      selectedDateSignal.value
    );
    if (!previousDayActiveTasks || previousDayActiveTasks.length === 0) {
      messageSignal.value = {
        severity: "error",
        text: "No tasks to copy from previous day",
      };
      return;
    }
    // debugger
    await queries.getAndCreateIfNotExistsTodoList(selectedDateSignal.value);
    await queries.upsertTodoList(
      selectedDateSignal.value,
      previousDayActiveTasks
    );
  }, []);

  const showManagementModal = useCallback(() => {
    activeModalSignal.value = { id: ModalID.SELECT_TASKS_MODAL };
  }, []);

  const showAddNewTaskModal = useCallback(() => {
    activeModalSignal.value = { id: ModalID.ADD_TASK_MODAL };
  }, []);

  return (
    <Box sx={emptyTodoListCSS}>
      <Box>
        <Typography
          sx={{ marginBottom: "1rem", textAlign: "center" }}
          variant="h2"
        >
          What will you do today?
        </Typography>
        <ButtonGroup variant="outlined" size="small">
          <Button onClick={getPreviousDatesTasks}>Copy Previous Day</Button>
          <Button onClick={showManagementModal}>Select Tasks</Button>
          <Button onClick={showAddNewTaskModal}>Add New Task</Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

const emptyTodoListCSS = css`
  height: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export default EmptyTodoList;
