import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    Box,
    Button,
    Checkbox,
    IconButton,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useState } from "react";
import { v4 as uuid4 } from "uuid";

import db from "../database/database";
import { activeModalSignal } from "../signals";
import type {
    EDayOfWeek,
    ERecurringFrequency,
    TRecurringTask,
} from "../types";
import { ERecurringFrequency as RecurringFrequency, ETaskStatus } from "../types";
import Modal from "./Modal";
import { SPACING } from "../styles/consts";

const DAY_ABBREV = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const FREQUENCY_LABELS = {
    [RecurringFrequency.EVERY_WEEK]: "Weekly",
    [RecurringFrequency.EVERY_OTHER_WEEK]: "Bi-weekly",
    [RecurringFrequency.MONTHLY]: "Monthly",
};

const FREQUENCY_TOOLTIPS = {
    [RecurringFrequency.EVERY_WEEK]: "Every week",
    [RecurringFrequency.EVERY_OTHER_WEEK]: "Every other week (even weeks)",
    [RecurringFrequency.MONTHLY]: "First week of each month",
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

    const handleAddTask = async () => {
        if (newTitle.trim() === "" || newDays.size === 0) return;

        const task: TRecurringTask = {
            id: uuid4(),
            title: newTitle.trim(),
            frequency: newFrequency,
            daysOfWeek: Array.from(newDays).sort(),
            details: "",
            status: ETaskStatus.NEW,
        };

        await db.recurringTasks.add(task);
        setNewTitle("");
        setNewDays(new Set());
    };

    const handleDeleteTask = async (id: string) => {
        await db.recurringTasks.delete(id);
    };

    const toggleDay = (day: EDayOfWeek) => {
        setNewDays((prev) => {
            const next = new Set(prev);
            if (next.has(day)) {
                next.delete(day);
            } else {
                next.add(day);
            }
            return next;
        });
    };

    const formatDays = (days: EDayOfWeek[]) => {
        return days.map((d) => DAY_ABBREV[d]).join(", ");
    };

    return (
        <Modal title="Recurring Tasks" showModal={true} styles={{ width: '800px' }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ p: SPACING.TINY.PX }}>Title</TableCell>
                        <TableCell sx={{ p: SPACING.TINY.PX }} width="120px">Frequency</TableCell>
                        <TableCell sx={{ p: SPACING.TINY.PX }} width="160px">Days</TableCell>
                        <TableCell sx={{ p: SPACING.TINY.PX }} width="50px"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {recurringTasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell sx={{ p: SPACING.TINY.PX }}>{task.title}</TableCell>
                            <TableCell sx={{ p: SPACING.TINY.PX }}>
                                <Tooltip title={FREQUENCY_TOOLTIPS[task.frequency]}>
                                    <span>{FREQUENCY_LABELS[task.frequency]}</span>
                                </Tooltip>
                            </TableCell >
                            <TableCell sx={{ p: SPACING.TINY.PX }}>{formatDays(task.daysOfWeek)}</TableCell>
                            <TableCell sx={{ p: SPACING.TINY.PX }}>
                                <IconButton
                                    size="small"
                                    onClick={() => handleDeleteTask(task.id)}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell sx={{ p: SPACING.TINY.PX }}>
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="New task..."
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddTask();
                                }}
                            />
                        </TableCell>
                        <TableCell sx={{ p: SPACING.TINY.PX }}>
                            <Select
                                size="small"
                                fullWidth
                                value={newFrequency}
                                onChange={(e) =>
                                    setNewFrequency(e.target.value as ERecurringFrequency)
                                }
                            >
                                <MenuItem value={RecurringFrequency.EVERY_WEEK}>
                                    Weekly
                                </MenuItem>
                                <MenuItem value={RecurringFrequency.EVERY_OTHER_WEEK}>
                                    Bi-weekly
                                </MenuItem>
                                <MenuItem value={RecurringFrequency.MONTHLY}>
                                    Monthly
                                </MenuItem>
                            </Select>
                        </TableCell>
                        <TableCell sx={{ p: SPACING.TINY.PX }}>
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                                    <>
                                        <Checkbox
                                            key={DAY_ABBREV[i]}
                                            size="small"
                                            checked={newDays.has(i)}
                                            onChange={() => toggleDay(i)}
                                            sx={{ padding: "2px" }}
                                        />
                                        <Typography>{DAY_ABBREV[i]}</Typography>
                                    </>
                                ))}
                            </Box>
                            {/* <Typography variant="caption" display="block">
                                {DAY_ABBREV.join(" ")}
                            </Typography> */}
                        </TableCell>
                        <TableCell sx={{ p: SPACING.TINY.PX }}>
                            <IconButton
                                size="small"
                                onClick={handleAddTask}
                                disabled={newTitle.trim() === "" || newDays.size === 0}
                                color="primary"
                            >
                                <AddIcon fontSize="small" />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleClose}>Close</Button>
            </Box>
        </Modal>
    );
};

export default RecurringTasksModal;
