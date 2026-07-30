import { useSignals } from "@preact/signals-react/runtime";
import { AnimatePresence } from "framer-motion";
import type { FC } from "react";
import { activeModalSignal } from "../signals";
import NewTaskModal from "./NewTaskModal";
import ChangelogModal, { type ChangelogModalProps } from "./ChangelogModal";
import ConfirmationModal, {
  type ConfirmationModalProps,
} from "./ConfirmationModal";
import HistoryModal from "./HistoryModal";
import { ModalID } from "./ids";
import RecurringTasksModal from "./RecurringTasksModal";
import SelectTasksModal from "./SelectTasksModal";
import SettingsModal from "./Settings";

export { ModalID };

export type ActiveModal =
  | { id: ModalID.NEW_TASK_MODAL }
  | { id: ModalID.SELECT_TASKS_MODAL }
  | { id: ModalID.BACKUP_FAILURE_MODAL }
  | { id: ModalID.SETTINGS_MODAL }
  | { id: ModalID.RECURRING_TASKS_MODAL }
  | { id: ModalID.HISTORY_MODAL }
  | ({ id: ModalID.CHANGELOG_MODAL } & ChangelogModalProps)
  | ({ id: ModalID.CONFIRMATION_MODAL } & ConfirmationModalProps);

const RenderModal: FC = () => {
  useSignals();

  return (
    <AnimatePresence mode="wait">
      {activeModalSignal.value?.id && (
        <div key={activeModalSignal.value.id}>
          {(() => {
            switch (activeModalSignal.value.id) {
              case ModalID.CHANGELOG_MODAL:
                return <ChangelogModal {...activeModalSignal.value} />;
              case ModalID.NEW_TASK_MODAL:
                return <NewTaskModal />;
              case ModalID.SELECT_TASKS_MODAL:
                return <SelectTasksModal />;
              case ModalID.RECURRING_TASKS_MODAL:
                return <RecurringTasksModal />;
              case ModalID.HISTORY_MODAL:
                return <HistoryModal />;
              case ModalID.SETTINGS_MODAL:
                return <SettingsModal />;
              case ModalID.CONFIRMATION_MODAL:
                return (
                  <ConfirmationModal
                    id={activeModalSignal.value.id}
                    title={activeModalSignal.value.title}
                    body={activeModalSignal.value.body}
                    cancelCallback={activeModalSignal.value.cancelCallback}
                    confirmationCallback={
                      activeModalSignal.value.confirmationCallback
                    }
                  />
                );
              default:
                return null;
            }
          })()}
        </div>
      )}
    </AnimatePresence>
  );
};

export default RenderModal;
