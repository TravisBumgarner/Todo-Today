import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  type SxProps,
  TextField,
  Typography,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import Tooltip from "../components/Tooltip";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useState } from "react";
import { v4 as uuid4 } from "uuid";

import { queries } from "../database";
import db from "../database/database";
import { activeModalSignal } from "../signals";
import { SPACING } from "../styles/consts";
import type {
  EDayOfWeek,
  ERecurringFrequency,
  TRecurringTask,
} from "../types";
import { ETaskStatus, ERecurringFrequency as RecurringFrequency } from "../types";
import Modal from "./Modal";

const DAY_ABBREV = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAYS: EDayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

const FREQUENCY_LABELS = {
  [RecurringFrequency.EVERY_WEEK]: "Weekly",
  [RecurringFrequency.EVERY_OTHER_WEEK]: "Every other week (1st / 3rd)",
  [RecurringFrequency.MONTHLY]: "Monthly (1st week)",
};

const RecurringTasksModal = () => {
  const recurringTasks = useLiveQuery(() => db.recurringTasks.toArray()) || [];
  const [newTitle, setNewTitle] = useState("");
  const [newFrequency, setNewFrequency] = useState<ERecurringFrequency>(
    RecurringFrequency.EVERY_WEEK
  );
  const [newDays, setNewDays] = useState<Set<EDayOfWeek>>(new Set());

  const handleClose = useCallback(() => {
    activeModalSignal.value = null;
  }, []);

  const canAdd = newTitle.trim() !== "" && newDays.size > 0;

  const handleAddTask = async () => {
    if (!canAdd) return;

    const task: TRecurringTask = {
      id: uuid4(),
      title: newTitle.trim(),
      frequency: newFrequency,
      daysOfWeek: Array.from(newDays).sort(),
      details: "",
      status: ETaskStatus.NEW,
    };

    await db.recurringTasks.add(task);
    // Add it to today straight away if it applies.
    await queries.processRecurringTasksForToday(task.id);

    setNewTitle("");
    setNewDays(new Set());
  };

  const handleDeleteTask = async (id: string) => {
    await db.recurringTasks.delete(id);
  };

  const toggleDay = (day: EDayOfWeek) => {
    setNewDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const formatDays = (days: EDayOfWeek[]) =>
    days.length === 7 ? "Every day" : days.map((d) => DAY_ABBREV[d]).join(" · ");

  return (
    <Modal title="Recurring Tasks" showModal={true} styles={{ width: 460 }}>
      {/* Create */}
      <Box sx={createCardSx}>
        <TextField
          size="small"
          fullWidth
          placeholder="New recurring task…"
          value={newTitle}
          spellCheck
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddTask();
          }}
        />

        <Box sx={{ display: "flex", gap: SPACING.TINY.PX, flexWrap: "wrap" }}>
          {DAYS.map((day) => {
            const selected = newDays.has(day);
            return (
              <Button
                key={day}
                size="small"
                variant={selected ? "contained" : "outlined"}
                onClick={() => toggleDay(day)}
                sx={dayChipSx}
              >
                {DAY_ABBREV[day]}
              </Button>
            );
          })}
        </Box>

        <Box sx={{ display: "flex", gap: SPACING.SMALL.PX }}>
          <Select
            size="small"
            fullWidth
            value={newFrequency}
            onChange={(e) =>
              setNewFrequency(e.target.value as ERecurringFrequency)
            }
          >
            <MenuItem value={RecurringFrequency.EVERY_WEEK}>
              {FREQUENCY_LABELS[RecurringFrequency.EVERY_WEEK]}
            </MenuItem>
            <MenuItem value={RecurringFrequency.EVERY_OTHER_WEEK}>
              {FREQUENCY_LABELS[RecurringFrequency.EVERY_OTHER_WEEK]}
            </MenuItem>
            <MenuItem value={RecurringFrequency.MONTHLY}>
              {FREQUENCY_LABELS[RecurringFrequency.MONTHLY]}
            </MenuItem>
          </Select>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disabled={!canAdd}
            onClick={handleAddTask}
          >
            New
          </Button>
        </Box>
      </Box>

      {/* Browse existing */}
      <Typography variant="h3" sx={{ mt: SPACING.MEDIUM.PX, mb: SPACING.SMALL.PX }}>
        {recurringTasks.length > 0
          ? `Existing (${recurringTasks.length})`
          : "Existing"}
      </Typography>

      {recurringTasks.length === 0 ? (
        <Typography variant="body2" sx={{ color: "text.secondary", pb: SPACING.SMALL.PX }}>
          No recurring tasks yet. Create one above and it will show up on the
          days you pick.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: SPACING.TINY.PX }}>
          {recurringTasks.map((task) => (
            <Box key={task.id} sx={taskRowSx}>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "14px" }}
                  noWrap
                >
                  {task.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                  {FREQUENCY_LABELS[task.frequency]} · {formatDays(task.daysOfWeek)}
                </Typography>
              </Box>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={() => handleDeleteTask(task.id)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ mt: SPACING.MEDIUM.PX, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={handleClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

const createCardSx: SxProps<Theme> = (theme) => ({
  display: "flex",
  flexDirection: "column",
  gap: SPACING.SMALL.PX,
  padding: SPACING.SMALL.PX,
  borderRadius: `${theme.shape.borderRadius}px`,
  bgcolor: theme.app.panel,
  border: `1px solid ${theme.palette.divider}`,
});

const dayChipSx: SxProps = {
  minWidth: 38,
  px: 0.5,
  fontSize: "12px",
};

const taskRowSx: SxProps<Theme> = (theme) => ({
  display: "flex",
  alignItems: "center",
  gap: SPACING.SMALL.PX,
  padding: `6px ${SPACING.SMALL.PX}`,
  borderRadius: `${theme.shape.borderRadius}px`,
  bgcolor: "background.paper",
  border: theme.app.border,
});

export default RecurringTasksModal;
