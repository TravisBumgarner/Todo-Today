import { useSignals } from '@preact/signals-react/runtime'
import { type FC } from 'react'
import { activeModalSignal } from '../signals'
import AddTaskModal from './AddTaskModal'
import AddWorkspaceModal from './AddWorkspaceModal'
import ConfirmationModal, { type ConfirmationModalProps } from './ConfirmationModal'
import EditWorkspaceModal from './EditWorkspaceModal'
import SelectTasksModal from './SelectTasksModal'
import SettingsModal from './Settings'

export enum ModalID {
  ADD_TASK_MODAL = 'ADD_TASK_MODAL',
  ADD_WORKSPACE_MODAL = 'ADD_WORKSPACE_MODAL',
  EDIT_TASK_MODAL = 'EDIT_TASK_MODAL',
  SELECT_TASKS_MODAL = 'SELECT_TASKS_MODAL',
  BACKUP_FAILURE_MODAL = 'BACKUP_FAILURE_MODAL',
  SETTINGS_MODAL = 'SETTINGS_MODAL',
  CONFIRMATION_MODAL = 'CONFIRMATION_MODAL',
  EDIT_WORKSPACE_MODAL = 'EDIT_WORKSPACE_MODAL'
}

export type ActiveModal =
  | { id: ModalID.ADD_TASK_MODAL }
  | { id: ModalID.ADD_WORKSPACE_MODAL }
  | { id: ModalID.SELECT_TASKS_MODAL }
  | { id: ModalID.BACKUP_FAILURE_MODAL }
  | { id: ModalID.SETTINGS_MODAL }
  | { id: ModalID.CONFIRMATION_MODAL } & ConfirmationModalProps
  | { id: ModalID.EDIT_WORKSPACE_MODAL, workspaceId: string }

const RenderModal: FC = () => {
  useSignals()

  if (!activeModalSignal.value?.id) return null

  switch (activeModalSignal.value.id) {
    case ModalID.ADD_TASK_MODAL:
      return <AddTaskModal />
    case ModalID.SELECT_TASKS_MODAL:
      return <SelectTasksModal />
    case ModalID.SETTINGS_MODAL:
      return <SettingsModal />
    case ModalID.CONFIRMATION_MODAL:
      return < ConfirmationModal
        id={activeModalSignal.value.id}
        title={activeModalSignal.value.title}
        body={activeModalSignal.value.body}
        cancelCallback={activeModalSignal.value.cancelCallback}
        confirmationCallback={activeModalSignal.value.confirmationCallback}
      />
    case ModalID.ADD_WORKSPACE_MODAL:
      return <AddWorkspaceModal />
    case ModalID.EDIT_WORKSPACE_MODAL:
      return <EditWorkspaceModal workspaceId={activeModalSignal.value.workspaceId} />
    default:
      return null
  }
}

export default RenderModal
