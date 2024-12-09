import { type Action } from 'Context'
import { ipcRenderer } from 'electron'
import { EAsyncMessageIPCFromMain, type AsyncBackupIPCFromMain } from 'shared/types'
import { setLocalStorage } from 'utilities'
import { messageSignal } from '../signals'

export const useIPCAsyncMessageEffect = (dispatch: React.Dispatch<Action>) => {
  ipcRenderer.on(EAsyncMessageIPCFromMain.UpdateAvailable, () => {
    ipcRenderer.removeAllListeners(EAsyncMessageIPCFromMain.UpdateAvailable)
    messageSignal.value = { text: 'A new update is available. Downloading now...', severity: 'info' }
  })

  ipcRenderer.on(EAsyncMessageIPCFromMain.UpdateDownloaded, () => {
    ipcRenderer.removeAllListeners(EAsyncMessageIPCFromMain.UpdateDownloaded)
    messageSignal.value = {
      text: 'Update Downloaded. It will be installed on restart.',
      severity: 'info',
      cancelText: '',
      confirmText: 'Ok'
    }
  })

  ipcRenderer.on(EAsyncMessageIPCFromMain.BackupCompleted, (_event, message: AsyncBackupIPCFromMain['body']) => {
    if (message.success) {
      setLocalStorage('lastBackup', message.timestamp)
      dispatch({ type: 'EDIT_USER_SETTING', payload: { key: 'lastBackup', value: message.timestamp } })
    } else {
      messageSignal.value = { text: 'Backup Failed. Please try again.', severity: 'error' }
    }
  })
}
