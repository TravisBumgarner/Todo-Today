import { useState, useContext } from 'react'
import moment from 'moment'
import { Box, Button, InputLabel, MenuItem, Select, Typography, css } from '@mui/material'

import database from 'database'
import { EColorTheme, EBackupInterval } from 'sharedTypes'
import {
  colorThemeOptionLabels,
  saveFile,
  getLocalStorage,
  setLocalStorage,
  backupIntervalLookup
} from 'utilities'
import Modal from './Modal'
import { context } from 'Context'
import { type BackupIPC } from '../../../shared/types'

const { ipcRenderer } = window.require('electron')

const createBackup = async () => {
  const data = {
    projects: await database.projects.toArray(),
    tasks: await database.tasks.toArray(),
    todoListItems: await database.todoListItems.toArray(),
    successes: await database.successes.toArray()
  }
  return data
}

const MINUTE_IN_MS = 1000 * 60
const backupIntervalToMilliseconds = {
  [EBackupInterval.MINUTELY]: MINUTE_IN_MS,
  [EBackupInterval.HOURLY]: MINUTE_IN_MS * 60,
  [EBackupInterval.DAILY]: MINUTE_IN_MS * 60 * 24,
  [EBackupInterval.WEEKLY]: MINUTE_IN_MS * 60 * 24 * 7,
  [EBackupInterval.MONTHLY]: MINUTE_IN_MS * 60 * 24 * 30
} as const

const runAutomatedBackup = (triggerBackupFailureModal: () => void) => {
  void createBackup().then(async (data) => {
    const response = await ipcRenderer.invoke(
      'backup',
      { filename: `${moment().toISOString()}.json`, data: JSON.stringify(data) } as BackupIPC
    )
    if (response.isSuccess === true) {
      setLocalStorage('lastBackup', moment().toLocaleString())
    } else {
      triggerBackupFailureModal()
    }
  })
}

const createNewBackupInterval = (
  triggerBackupFailureModal: () => void,
  backupIntervalInMilliseconds: number
) => {
  clearInterval(window.automatedBackupIntervalId)
  window.automatedBackupIntervalId = setInterval(() => {
    runAutomatedBackup(triggerBackupFailureModal)
  }, backupIntervalInMilliseconds)
}

const setupAutomatedBackup = (triggerBackupFailureModal: () => void) => {
  const backupInterval = getLocalStorage('backupInterval') as EBackupInterval
  if (backupInterval === EBackupInterval.OFF) {
    return
  }
  const lastBackup = getLocalStorage('lastBackup')

  const lastBackupThreshold = moment()
  lastBackupThreshold.subtract(backupIntervalToMilliseconds[backupInterval], 'milliseconds')

  if (!lastBackup || moment(lastBackup) < lastBackupThreshold) {
    runAutomatedBackup(triggerBackupFailureModal)
  }
  createNewBackupInterval(triggerBackupFailureModal, backupIntervalToMilliseconds[backupInterval])
}

const Settings = () => {
  const { state, dispatch } = useContext(context)
  const [restore, setRestore] = useState<File | null>(null)

  const handleBackup = async () => {
    const data = await createBackup()
    if (!data) {
      alert('no data')
    } else {
      void saveFile(`${moment().toISOString()}.json`, data)
    }
  }

  const handleSubmit = ({ key, value }: { key: string, value: string }) => {
    dispatch({ type: 'EDIT_USER_SETTING', payload: { key, value } })
  }

  const handleRestore = () => {
    if (restore) {
      const reader = new FileReader()
      reader.readAsText(restore, 'UTF-8')
      reader.onload = async function (event) {
        if (event.target?.result) {
          const newStore = JSON.parse(event.target.result as string)

          await Promise.all([
            database.projects.clear(),
            database.tasks.clear(),
            database.todoListItems.clear(),
            database.successes.clear()
          ])

          await Promise.all([
            database.projects.bulkAdd(newStore.projects),
            database.tasks.bulkAdd(newStore.tasks),
            database.todoListItems.bulkAdd(newStore.todoListItems),
            database.successes.bulkAdd(newStore.successes)
          ])
          setRestore(null)
        } else {
          alert('bad data')
        }
      }
    }
  }

  return (
    <Modal
      title="Settings"
      showModal={true}
    >
      <Box css={sectionWrapperCSS}>
        <Typography variant="h4">Theme</Typography>
        <Select
          fullWidth
          labelId="color-theme"
          value={state.settings.colorTheme}
          label="Color Theme"
          onChange={(event) => { handleSubmit({ key: 'colorTheme', value: event.target.value }) }}
        >
          {Object.keys(EColorTheme).map(key => <MenuItem key={key} value={key}>{colorThemeOptionLabels[key as EColorTheme]}</MenuItem>)}
        </Select>
      </Box>

      <Box css={sectionWrapperCSS}>
        <Typography variant="h4">Backup</Typography>
        <Button fullWidth variant='contained' onClick={async () => { await handleBackup() }}>Create Backup</Button>
      </Box>

      <Box css={sectionWrapperCSS}>
        <Select
          fullWidth
          labelId="backup-interval"
          value={state.settings.backupInterval}
          label="Color Theme"
          onChange={(event) => { dispatch({ type: 'EDIT_USER_SETTING', payload: { key: 'backupInterval', value: event.target.value } }) }}
        >
          {Object.keys(EBackupInterval).map(key => <MenuItem key={key} value={key}>{backupIntervalLookup[key as EBackupInterval]}</MenuItem>)}
        </Select>
        <Typography variant="body2">Last Backup: {getLocalStorage('lastBackup')}</Typography>
        <Typography variant="body2">Backup Location: {state.settings.backupDir}</Typography>
      </Box>

      <Box css={sectionWrapperCSS}>

        <Typography variant="h4">Restore</Typography>
        <input
          onChange={(event) => { event.target.files && setRestore(event.target.files[0]) }}
          name="file"
          type="file"
        />
        <Button
          disabled={!restore}
          onClick={handleRestore}
          fullWidth
          variant='contained'
        >
          Restore from Backup
        </Button>
      </Box>
    </Modal >
  )
}

const sectionWrapperCSS = css`
  border-radius: 1rem;
  padding: 0.5rem 0;
  margin: 1rem 0;
`

export default Settings
export { setupAutomatedBackup }
