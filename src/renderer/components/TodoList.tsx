import ContentCopyIcon from "@mui/icons-material/ContentCopyOutlined";
import HistoryIcon from "@mui/icons-material/HistoryOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  type SxProps,
} from "@mui/material";
import { useSignals } from "@preact/signals-react/runtime";
import Tooltip from "./Tooltip";
import { useLiveQuery } from "dexie-react-hooks";
import { Reorder } from "framer-motion";
import { useCallback } from "react";

import {
  copyPreviousDay,
  goToNextDay,
  goToPreviousDay,
  goToToday,
  openHistoryModal,
  openNewTaskModal,
  openRecurringTasksModal,
  openSelectTasksModal,
  openSettingsModal,
} from "../actions";
import { database, queries } from "../database";
import { MOD } from "../hooks/useKeyboardShortcuts";
import { selectedDateSignal } from "../signals";
import { SPACING } from "../styles/consts";
import { ETaskStatus } from "../types";
import { formatDateDisplayString } from "../utilities";
import EmptyTodoList from "./EmptyTodoList";
import TodoItem from "./TodoItem";

const TodoList = () => {
  useSignals();

  const taskIds = useLiveQuery(async () => {
    const todoList = await database.todoList
      .where({ date: selectedDateSignal.value })
      .first();

    // Sort tasks by status so anything complete or canceled is at the bottom
    const taskIdsList = todoList?.taskIds ?? [];
    const tasks = await Promise.all(
      taskIdsList.map(async (id) => await database.tasks.get(id))
    );

    const sortedTaskIds = [...taskIdsList].sort((a, b) => {
      const taskA = tasks.find((t) => t?.id === a);
      const taskB = tasks.find((t) => t?.id === b);
      const statusA = taskA?.status;
      const statusB = taskB?.status;

      if (
        statusA === ETaskStatus.CANCELED ||
        statusA === ETaskStatus.COMPLETED
      )
        return 1;
      if (
        statusB === ETaskStatus.CANCELED ||
        statusB === ETaskStatus.COMPLETED
      )
        return -1;
      return 0;
    });

    return sortedTaskIds
  }, [selectedDateSignal.value], [] as string[]);

  const onReorder = useCallback(async (newTaskIds: string[]) => {
    await queries.reorderTasks(selectedDateSignal.value, newTaskIds);
  }, []);

  if (!taskIds) {
    return null; // or a loading spinner
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        height: "100%",
      }}
    >
      <Box sx={buttonWrapperCSS}>
        <Box sx={{ display: "flex", gap: SPACING.TINY.PX }}>
          {/* Labels stay short so the row never wraps — the tooltips carry the
              full name and the shortcut. */}
          <Tooltip title={`New Task (${MOD}N)`}>
            <Button variant="outlined" onClick={openNewTaskModal}>
              New
            </Button>
          </Tooltip>
          <Tooltip title={`Select Tasks (${MOD}S)`}>
            <Button variant="outlined" onClick={openSelectTasksModal}>
              Select
            </Button>
          </Tooltip>
          <Tooltip title={`Manage Recurring (${MOD}M)`}>
            <Button variant="outlined" onClick={openRecurringTasksModal}>
              Recurring
            </Button>
          </Tooltip>
        </Box>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: SPACING.SMALL.PX }}
        >
          <ButtonGroup variant="outlined">
            <Tooltip title={`Previous day (${MOD}←)`}>
              <Button onClick={goToPreviousDay}>&lt;</Button>
            </Tooltip>
            <Tooltip title={`Today (${MOD}T)`}>
              <Button sx={todayButtonCSS} onClick={goToToday}>
                <span>{formatDateDisplayString(selectedDateSignal.value)}</span>
              </Button>
            </Tooltip>
            <Tooltip title={`Next day (${MOD}→)`}>
              <Button onClick={goToNextDay}>&gt;</Button>
            </Tooltip>
          </ButtonGroup>
          <IconButton size="small" onClick={copyPreviousDay}>
            <Tooltip title={`Copy previous day (${MOD}P)`}>
              <ContentCopyIcon fontSize="small" />
            </Tooltip>
          </IconButton>
          <IconButton size="small" onClick={openHistoryModal}>
            <Tooltip title={`History (${MOD}Y)`}>
              <HistoryIcon fontSize="small" />
            </Tooltip>
          </IconButton>
          <IconButton size="small" onClick={openSettingsModal}>
            <Tooltip title="Settings">
              <SettingsIcon />
            </Tooltip>
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: SPACING.TINY.PX,
        }}
      >
        {taskIds.length === 0 && <EmptyTodoList />}
        {taskIds.length > 0 && (
          <Reorder.Group
            axis="y"
            values={taskIds}
            onReorder={onReorder}
            style={{ padding: 0, margin: 0 }}
          >
            {taskIds.map((taskId) => (
              <Reorder.Item
                key={taskId}
                value={taskId}
                style={{ listStyle: "none" }}
                onPointerDownCapture={(e) => {
                  const target = e.target as HTMLElement;
                  if (
                    target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.isContentEditable ||
                    target.closest('[contenteditable="true"]') ||
                    target.closest(".MuiTextField-root")
                  ) {
                    e.stopPropagation();
                  }
                }}
              >
                <TodoItem key={taskId} taskId={taskId} />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </Box>
    </Box>
  );
};

export const buttonWrapperCSS: SxProps = {
  zIndex: 999,
  display: "flex",
  position: "sticky",
  backgroundColor: "background.default",
  padding: `${SPACING.SMALL.PX}`,
  top: 0,
  justifyContent: "space-between",
  marginBottom: SPACING.SMALL.PX,
  alignItems: "center",
};

// In a ButtonGroup the middle button's side borders overlap its neighbors, so
// on hover we raise it above them (zIndex) and force all four borders to the
// accent color — otherwise only the top/bottom edges appear to change.
const todayButtonCSS: SxProps = {
  width: 150,
  "&:hover span": { display: "none" },
  "&:hover::before": { content: '"Today"' },
  "&:hover": {
    zIndex: 1,
    borderColor: "primary.main",
    borderLeftColor: "primary.main",
    borderRightColor: "primary.main",
  },
};

export default TodoList;
