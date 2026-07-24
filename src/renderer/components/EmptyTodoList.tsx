import { Box, Button, css, Typography } from "@mui/material";
import { useCallback } from "react";

import { useSignals } from "@preact/signals-react/runtime";
import { ModalID } from "../modals";
import { activeModalSignal } from "../signals";
import { SPACING } from "../styles/consts";
import { useCopyPreviousDay } from "../hooks/useCopyPreviousDay";

const EmptyTodoList = () => {
  useSignals();
  const getPreviousDatesTasks = useCopyPreviousDay();

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
        <Box
          sx={{
            display: "flex",
            gap: SPACING.TINY.PX,
            justifyContent: "center",
          }}
        >
          <Button variant="outlined" onClick={getPreviousDatesTasks}>
            Copy Previous Day
          </Button>
          <Button variant="outlined" onClick={showManagementModal}>
            Select Tasks
          </Button>
          <Button variant="outlined" onClick={showAddNewTaskModal}>
            Add New Task
          </Button>
        </Box>
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
