import { useSignals } from "@preact/signals-react/runtime";
import { AnimatePresence } from "framer-motion";
import { type FC } from "react";
import { activeModalSignal } from "../signals";
import AddTaskModal from "./AddTaskModal";
import ConfirmationModal, {
  type ConfirmationModalProps,
} from "./ConfirmationModal";
import SelectTasksModal from "./SelectTasksModal";
import SettingsModal from "./Settings";

export enum ModalID {
  ADD_TASK_MODAL = "ADD_TASK_MODAL",
  EDIT_TASK_MODAL = "EDIT_TASK_MODAL",
  SELECT_TASKS_MODAL = "SELECT_TASKS_MODAL",
  BACKUP_FAILURE_MODAL = "BACKUP_FAILURE_MODAL",
  SETTINGS_MODAL = "SETTINGS_MODAL",
  CONFIRMATION_MODAL = "CONFIRMATION_MODAL",
}

export type ActiveModal =
  | { id: ModalID.ADD_TASK_MODAL }
  | { id: ModalID.SELECT_TASKS_MODAL }
  | { id: ModalID.BACKUP_FAILURE_MODAL }
  | { id: ModalID.SETTINGS_MODAL }
  | ({ id: ModalID.CONFIRMATION_MODAL } & ConfirmationModalProps);

const RenderModal: FC = () => {
  useSignals();

  return (
    <AnimatePresence mode="wait">
      {activeModalSignal.value?.id && (
        <div key={activeModalSignal.value.id}>
          {(() => {
            switch (activeModalSignal.value.id) {
              case ModalID.ADD_TASK_MODAL:
                return <AddTaskModal />;
              case ModalID.SELECT_TASKS_MODAL:
                return <SelectTasksModal />;
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
