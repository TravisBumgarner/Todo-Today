import { Box, Button, css, FormControl, InputLabel, MenuItem, Select, Typography, type SelectChangeEvent } from '@mui/material'
import { useSignalEffect } from '@preact/signals-react'
import moment from 'moment'
import { useCallback, useState } from 'react'

import { database } from 'database'
import { EColorTheme } from 'types'
import {
  colorThemeOptionLabels,
  saveFile,
  setLocalStorage
} from 'utilities'
import { DATE_BACKUP_DATE } from '../../shared/utilities'
import { activeModalSignal, isRestoringSignal, settingsSignal } from '../signals'
import Modal from './Modal'
import { ModalID } from './RenderModal'

const copyIndexedDBToObject = async () => {
  const data = {
    tasks: await database.tasks.toArray(),
    todoLists: await database.todoList.toArray()
  }
  return data
}

const Settings = () => {
  const [restoreFile, setRestoreFile] = useState<File | null>(null)

  const syncSettingsToLocalStorage = useCallback(() => {
    if (settingsSignal.value) {
      Object.entries(settingsSignal.value).forEach(([key, value]) => {
        setLocalStorage(key as keyof typeof settingsSignal.value, value)
      })
    }
  }, [])
  useSignalEffect(syncSettingsToLocalStorage)

  const handleBackup = async () => {
    const backupData = await copyIndexedDBToObject()
    if (!backupData) {
      activeModalSignal.value = {
        id: ModalID.CONFIRMATION_MODAL,
        title: 'Something went wrong',
        body: 'There is no data to backup'
      }
    } else {
      const backupDate = moment().format(DATE_BACKUP_DATE)
      void saveFile(`${backupDate}.json`, backupData)
    }
  }

  const handleThemeChange = useCallback((event: SelectChangeEvent<EColorTheme>) => {
    settingsSignal.value = { ...settingsSignal.value, colorTheme: event.target.value as EColorTheme }
  }, [])

  const restore = useCallback((restoreFile: File | null) => {
    isRestoringSignal.value = true
    if (restoreFile) {
      const reader = new FileReader()
      reader.readAsText(restoreFile, 'UTF-8')
      reader.onload = async function (event) {
        try {
          if (event.target?.result) {
            const { todoLists, tasks } = JSON.parse(event.target.result as string)

            await Promise.all([
              database.tasks.clear(),
              database.todoList.clear()
            ])

            await Promise.all([
              database.tasks.bulkAdd(tasks),
              database.todoList.bulkAdd(todoLists)
            ])
          } else {
            activeModalSignal.value = {
              id: ModalID.CONFIRMATION_MODAL,
              title: 'Something went Wrong',
              body: 'Please select a valid backup file and try again'
            }
          }
        } catch (error) {
          activeModalSignal.value = {
            id: ModalID.CONFIRMATION_MODAL,
            title: 'Something went Wrong',
            body: 'Please select a valid backup file and try again'
          }
          isRestoringSignal.value = false
        }
      }
    }
    isRestoringSignal.value = false
  }, [])

  const handleRestoreClick = useCallback(() => {
    activeModalSignal.value = {
      id: ModalID.CONFIRMATION_MODAL,
      title: 'Restore from Backup?',
      body: 'All current data will be lost.',
      confirmationCallback: () => { restore(restoreFile) }
    }
  }, [restore, restoreFile])

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
            value={settingsSignal.value.colorTheme}
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
        </Box>
        <Button fullWidth variant='outlined' onClick={handleBackup}>Create Backup</Button>

      </Box>

      <Box css={sectionWrapperCSS}>
        <Typography variant="h3">Restore</Typography>
        <Button
          variant="outlined"
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
          variant='outlined'
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
