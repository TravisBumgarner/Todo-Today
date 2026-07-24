import { useCallback } from "react";
import { queries } from "../database";
import { messageSignal, selectedDateSignal } from "../signals";

/**
 * Copies the previous day's still-active tasks into the selected day, MERGING
 * with whatever is already there (e.g. recurring tasks) rather than replacing
 * it. Shared by the empty-state and the always-available toolbar action.
 */
export const useCopyPreviousDay = () => {
  return useCallback(async () => {
    const date = selectedDateSignal.value;
    const previousDayActiveTasks = await queries.getPreviousDayActiveTasks(date);

    if (!previousDayActiveTasks || previousDayActiveTasks.length === 0) {
      messageSignal.value = {
        severity: "error",
        text: "No tasks to copy from the previous day",
      };
      return;
    }

    const todoList = await queries.getAndCreateIfNotExistsTodoList(date);
    const existing = todoList.taskIds ?? [];
    const merged = [...existing];
    for (const id of previousDayActiveTasks) {
      if (!merged.includes(id)) merged.push(id);
    }

    const added = merged.length - existing.length;
    await queries.upsertTodoList(date, merged);

    messageSignal.value = {
      severity: added > 0 ? "success" : "info",
      text:
        added > 0
          ? `Copied ${added} task${added === 1 ? "" : "s"} from the previous day`
          : "Those tasks are already on today's list",
    };
  }, []);
};
