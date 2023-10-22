import { useState, useContext, useCallback } from 'react'
import moment from 'moment'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent, Typography, css } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { HtmlTooltip } from 'sharedComponents'

import {
  sendAsyncIPCMessage,
  colorThemeOptionLabels,
  saveFile,
  getLocalStorage,
  setLocalStorage,
  backupIntervalLookup
} from 'utilities'
import database from 'database'
import { EColorTheme, EBackupInterval } from 'types'
import Modal from './Modal'
import { context } from 'Context'
import { ModalID } from './RenderModal'
import { EAsyncMessageIPCFromRenderer } from 'shared/types'
import { DATE_BACKUP_DATE } from 'shared/utilities'

const copyIndexedDBToObject = async () => {
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
  [EBackupInterval.DAILY]: MINUTE_IN_MS * 60 * 24,
  [EBackupInterval.WEEKLY]: MINUTE_IN_MS * 60 * 24 * 7,
  [EBackupInterval.MONTHLY]: MINUTE_IN_MS * 60 * 24 * 30,
  [EBackupInterval.OFF]: Infinity
} as const

const runAutomatedBackup = async () => {
  const backupData = await copyIndexedDBToObject()
  const payload = {
    type: EAsyncMessageIPCFromRenderer.CreateBackup,
    body: {
      filename: `${moment().format(DATE_BACKUP_DATE)}.json`,
      data: JSON.stringify(backupData)
    }
  } as const
  sendAsyncIPCMessage(payload)
}

const setupAutomatedBackup = () => {
  const backupInterval = getLocalStorage('backupInterval')
  clearInterval(window.automatedBackupIntervalId)

  if (Object.values(EBackupInterval).includes(backupInterval)) {
    if (backupInterval === EBackupInterval.OFF) {
      return
    }

    window.automatedBackupIntervalId = setInterval(() => {
      void runAutomatedBackup()
    }, backupIntervalToMilliseconds[backupInterval as EBackupInterval])
  }
}

const Settings = () => {
  const { state, dispatch } = useContext(context)
  const [restoreFile, setRestoreFile] = useState<File | null>(null)

  const handleBackup = async () => {
    const backupData = await copyIndexedDBToObject()
    if (!backupData) {
      dispatch({
        type: 'SET_ACTIVE_MODAL',
        payload: {
          id: ModalID.CONFIRMATION_MODAL,
          title: 'Something went wrong',
          body: 'There is no data to backup'
        }
      })
    } else {
      const backupDate = moment().format(DATE_BACKUP_DATE)
      void saveFile(`${backupDate}.json`, backupData)
      setLocalStorage('lastBackup', backupDate)
      dispatch({ type: 'EDIT_USER_SETTING', payload: { key: 'lastBackup', value: backupDate } })
    }
  }

  const handleThemeChange = useCallback((event: SelectChangeEvent<EColorTheme>) => {
    dispatch({ type: 'EDIT_USER_SETTING', payload: { key: 'colorTheme', value: event.target.value } })
  }, [dispatch])

  const handleBackupIntervalChange = useCallback((event: SelectChangeEvent<EBackupInterval>) => {
    dispatch({ type: 'EDIT_USER_SETTING', payload: { key: 'backupInterval', value: event.target.value } })
  }, [dispatch])

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

  const handleRestoreClick = useCallback(() => {
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
            onChange={handleThemeChange}
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
              <Typography variant="body2"><Box component="span" fontWeight={700}>Last Backup<br /></Box> {state.settings.lastBackup ?? 'No backups yet'}</Typography>
              <Typography variant="body2"><Box component="span" fontWeight={700}>Location<br /></Box> {state.settings.backupDir}</Typography></>
          }>
            <HelpOutlineIcon color="primary" fontSize='small' />
          </HtmlTooltip>
        </Box>
        <Button fullWidth variant='contained' onClick={handleBackup}>Create Manul Backup</Button>
        <FormControl fullWidth margin='normal'>
          <InputLabel id="setting-modal-backup-interval">Automated Backup Interval</InputLabel>
          <Select
            margin='dense'
            fullWidth
            labelId="setting-modal-backup-interval"
            value={state.settings.backupInterval}
            label="Automated Backup Interval"
            onChange={handleBackupIntervalChange}
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
          onClick={handleRestoreClick}
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
