import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Button,
  ButtonGroup,
  css,
  IconButton,
  SxProps,
  Tooltip,
} from "@mui/material";
import { useSignals } from "@preact/signals-react/runtime";
import { useLiveQuery } from "dexie-react-hooks";
import { Reorder } from "framer-motion";
import moment from "moment";
import { useCallback, useState } from "react";

import { database, queries } from "../database";
import { ModalID } from "../modals";
import { activeModalSignal, selectedDateSignal } from "../signals";
import { SPACING } from "../styles/consts";
import { DATE_ISO_DATE_MOMENT_STRING, ETaskStatus } from "../types";
import { formatDateDisplayString, formatDateKeyLookup } from "../utilities";
import EmptyTodoList from "./EmptyTodoList";
import TodoItem from "./TodoItem";

const TodoList = () => {
  useSignals();
  const [taskIds, setTaskIds] = useState<string[]>([]);

  useLiveQuery(async () => {
    setTaskIds(
      await database.todoList
        .where({ date: selectedDateSignal.value })
        .first()
        .then(async (todoList) => {
          // Sort tasks by status so anything complete or canceled is at the bottom
          const taskIds = todoList?.taskIds ?? [];
          const tasks = await Promise.all(
            taskIds.map(async (id) => await database.tasks.get(id))
          );
          return taskIds.sort((a, b) => {
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
        })
    );
  }, [selectedDateSignal.value]);

  const onReorder = useCallback(async (newTaskIds: string[]) => {
    await queries.reorderTasks(selectedDateSignal.value, newTaskIds);
  }, []);

  const showManagementModal = useCallback(() => {
    activeModalSignal.value = { id: ModalID.SELECT_TASKS_MODAL };
  }, []);

  const showAddNewTaskModal = useCallback(() => {
    activeModalSignal.value = { id: ModalID.ADD_TASK_MODAL };
  }, []);

  const setPreviousDate = useCallback(() => {
    selectedDateSignal.value = formatDateKeyLookup(
      moment(selectedDateSignal.value, DATE_ISO_DATE_MOMENT_STRING).subtract(
        1,
        "day"
      )
    );
  }, []);

  const getNextDate = useCallback(() => {
    selectedDateSignal.value = formatDateKeyLookup(
      moment(selectedDateSignal.value, DATE_ISO_DATE_MOMENT_STRING).add(
        1,
        "day"
      )
    );
  }, []);

  const getToday = useCallback(() => {
    selectedDateSignal.value = formatDateKeyLookup(moment());
  }, []);

  const handleSettings = useCallback(() => {
    activeModalSignal.value = { id: ModalID.SETTINGS_MODAL };
  }, []);

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
          <Button variant="outlined" onClick={showAddNewTaskModal}>
            Add New Task
          </Button>
          <Button variant="outlined" onClick={showManagementModal}>
            Select Tasks
          </Button>
        </Box>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: SPACING.SMALL.PX }}
        >
          <ButtonGroup variant="outlined">
            <Button onClick={setPreviousDate}>&lt;</Button>
            <Button sx={todayButtonCSS} onClick={getToday}>
              <span>{formatDateDisplayString(selectedDateSignal.value)}</span>
            </Button>
            <Button onClick={getNextDate}>&gt;</Button>
          </ButtonGroup>
          <IconButton size="small" onClick={handleSettings}>
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
          padding: SPACING.SMALL.PX,
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

const todayButtonCSS = css`
  width: 150px;
  &:hover span {
    display: none;
  }

  :hover:before {
    content: "Go to Today";
  }
`;

export default TodoList;
