import { Box, Button, css, Typography } from "@mui/material";

import { useSignals } from "@preact/signals-react/runtime";
import {
  copyPreviousDay,
  openNewTaskModal,
  openSelectTasksModal,
} from "../actions";
import { MOD } from "../hooks/useKeyboardShortcuts";
import { SPACING } from "../styles/consts";
import Tooltip from "./Tooltip";

const EmptyTodoList = () => {
  useSignals();

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
          <Tooltip title={`Copy Previous Day (${MOD}P)`}>
            <Button variant="outlined" onClick={copyPreviousDay}>
              Copy Previous Day
            </Button>
          </Tooltip>
          <Tooltip title={`Select Tasks (${MOD}S)`}>
            <Button variant="outlined" onClick={openSelectTasksModal}>
              Select Tasks
            </Button>
          </Tooltip>
          <Tooltip title={`New Task (${MOD}N)`}>
            <Button variant="outlined" onClick={openNewTaskModal}>
              New Task
            </Button>
          </Tooltip>
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
