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
    Typography,
} from "@mui/material";
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

const FREQUENCY_LABELS = {
    [RecurringFrequency.EVERY_WEEK]: "Weekly",
    [RecurringFrequency.EVERY_OTHER_WEEK]: "Bi-weekly (1st / 3rd week)",
    [RecurringFrequency.MONTHLY]: "Monthly (1st week of month)",
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

        // Process this recurring task immediately to add it to today if applicable
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
                                    {FREQUENCY_LABELS[RecurringFrequency.EVERY_WEEK]}
                                </MenuItem>
                                <MenuItem value={RecurringFrequency.EVERY_OTHER_WEEK}>
                                    {FREQUENCY_LABELS[RecurringFrequency.EVERY_OTHER_WEEK]}
                                </MenuItem>
                                <MenuItem value={RecurringFrequency.MONTHLY}>
                                    {FREQUENCY_LABELS[RecurringFrequency.MONTHLY]}
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
                                <AddIcon fontSize="medium" />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                    {recurringTasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell sx={{ p: SPACING.TINY.PX }}>{task.title}</TableCell>
                            <TableCell sx={{ p: SPACING.TINY.PX }}>
                                <span>{FREQUENCY_LABELS[task.frequency]}</span>
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

                </TableBody>
            </Table>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleClose}>Close</Button>
            </Box>
        </Modal>
    );
};

export default RecurringTasksModal;
