import { useState, useContext, useCallback, useEffect } from 'react'
import moment from 'moment'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, css } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { HtmlTooltip } from 'sharedComponents'

import database from 'database'
import { EColorTheme, EBackupInterval, DATE_BACKUP_DATE } from 'types'
import {
  colorThemeOptionLabels,
  saveFile,
  getLocalStorage,
  setLocalStorage,
  backupIntervalLookup
} from 'utilities'
import Modal from './Modal'
import { type State, context } from 'Context'
import { type BackupIPC } from '../sharedTypes'
import { ModalID } from './RenderModal'
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
      { filename: `${moment().format(DATE_BACKUP_DATE)}.json`, data: JSON.stringify(data) } as BackupIPC
    )
    if (response.isSuccess === true) {
      setLocalStorage('lastBackup', moment().format(DATE_BACKUP_DATE))
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
  const [restoreFile, setRestoreFile] = useState<File | null>(null)
  const [refreshBackupDate, shouldRefreshBackupDate] = useState(false)
  const [lastBackup, setLastBackup] = useState<string | null>(null)

  const handleBackup = async () => {
    const data = await createBackup()
    if (!data) {
      dispatch({
        type: 'SET_ACTIVE_MODAL',
        payload: {
          id: ModalID.CONFIRMATION_MODAL,
          title: 'Something went Wrong',
          body: 'There is no data to backup'
        }
      })
    } else {
      const backupDate = moment().format(DATE_BACKUP_DATE)
      void saveFile(`${backupDate}.json`, data)
      setLocalStorage('lastBackup', backupDate)
      shouldRefreshBackupDate(prev => !prev)
    }
  }

  useEffect(() => {
    setLastBackup(getLocalStorage('lastBackup'))
  }, [refreshBackupDate])

  const handleSubmit = ({ key, value }: {
    key: keyof State['settings']
    value: string
  }) => {
    dispatch({ type: 'EDIT_USER_SETTING', payload: { key, value } })
  }

  const restore = useCallback((restoreFile: File | null) => {
    dispatch({ type: 'RESTORE_STARTED' })
    if (restoreFile) {
      const reader = new FileReader()
      reader.readAsText(restoreFile, 'UTF-8')
      reader.onload = async function (event) {
        try {
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
          } else {
            dispatch({
              type: 'SET_ACTIVE_MODAL',
              payload: {
                id: ModalID.CONFIRMATION_MODAL,
                title: 'Something went Wrong',
                body: 'Please select a valid backup file and try again'
              }
            })
          }
        } catch (error) {
          dispatch({
            type: 'SET_ACTIVE_MODAL',
            payload: {
              id: ModalID.CONFIRMATION_MODAL,
              title: 'Something went Wrong',
              body: 'Please select a valid backup file and try again'
            }
          })
        }
      }
    }
    dispatch({ type: 'RESTORE_ENDED' })
  }, [dispatch])

  const handleRestore = useCallback(() => {
    dispatch({
      type: 'SET_ACTIVE_MODAL',
      payload: {
        id: ModalID.CONFIRMATION_MODAL,
        title: 'Restore from Backup?',
        body: 'All current data will be lost.',
        confirmationCallback: () => { restore(restoreFile) }
      }
    })
  }, [dispatch, restore, restoreFile])

  return (
    <Modal
      title="Settings"
      showModal={true}
    >
      <Box css={sectionWrapperCSS}>
        <Typography variant="h3">Theme</Typography>
        <FormControl fullWidth margin='normal'>
          <InputLabel id="setting-modal-color-theme">Color Theme</InputLabel>
          <Select
            fullWidth
            labelId="setting-modal-color-theme"
            value={state.settings.colorTheme}
            label="Color Theme"
            onChange={(event) => { handleSubmit({ key: 'colorTheme', value: event.target.value }) }}
          >
            {Object.keys(EColorTheme).map(key => <MenuItem key={key} value={key}>{colorThemeOptionLabels[key as EColorTheme]}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <Box css={sectionWrapperCSS}>
        <Box css={sectionHeaderWrapperCSS}>
          <Typography variant="h3">Backup</Typography>
          <HtmlTooltip title={
            <>
              <Typography variant="body2"><Box component="span" fontWeight={700}>Last Backup<br /></Box> {lastBackup}</Typography>
              <Typography variant="body2"><Box component="span" fontWeight={700}>Location<br /></Box> {state.settings.backupDir}</Typography></>
          }>
            <HelpOutlineIcon color="primary" fontSize='small' />
          </HtmlTooltip>
        </Box>
        <Button fullWidth variant='contained' onClick={async () => { await handleBackup() }}>Create Backup</Button>
        <FormControl fullWidth margin='normal'>
          <InputLabel id="setting-modal-backup-interval">Backup Interval</InputLabel>
          <Select
            margin='dense'
            fullWidth
            labelId="setting-modal-backup-interval"
            value={state.settings.backupInterval}
            label="Backup Interval"
            onChange={(event) => { dispatch({ type: 'EDIT_USER_SETTING', payload: { key: 'backupInterval', value: event.target.value } }) }}
          >
            {Object.keys(EBackupInterval).map(key => <MenuItem key={key} value={key}>{backupIntervalLookup[key as EBackupInterval]}</MenuItem>)}
          </Select>
        </FormControl>

      </Box>

      <Box css={sectionWrapperCSS}>

        <Typography variant="h3">Restore</Typography>
        <Button
          variant="contained"
          component="label"
          fullWidth
        >
          Choose File
          <input
            onChange={(event) => { event.target.files && setRestoreFile(event.target.files[0]) }}
            type="file"
            hidden
          />
        </Button>
        <Typography css={fileNameCSS} variant='body1'>Filename: {restoreFile ? restoreFile.name : ''}</Typography>
        <Button
          disabled={!restoreFile}
          onClick={handleRestore}
          fullWidth
          variant='contained'
        >
          Restore
        </Button>
      </Box>
    </Modal >
  )
}

const sectionWrapperCSS = css`
  border-radius: 1rem;
  padding: 1rem;
  margin: 1rem 0;
  background-color: var(--mui-palette-background-paper);
`

const fileNameCSS = css`
  margin: 0.5rem 0;
`

const sectionHeaderWrapperCSS = css`
  display: flex;
  justify-content: space-between;
`

export default Settings
export { setupAutomatedBackup }
