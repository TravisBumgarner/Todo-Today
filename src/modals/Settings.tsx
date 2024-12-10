import { Box, Button, css, FormControl, InputLabel, MenuItem, Select, Typography, type SelectChangeEvent } from '@mui/material'
import moment from 'moment'
import { useCallback, useContext, useState } from 'react'

import { context } from 'Context'
import database from 'database'
import { DATE_BACKUP_DATE } from 'shared/utilities'
import { EColorTheme } from 'types'
import {
  colorThemeOptionLabels,
  saveFile
} from 'utilities'
import { activeModalSignal, settingsSignal } from '../signals'
import Modal from './Modal'
import { ModalID } from './RenderModal'

const copyIndexedDBToObject = async () => {
  const data = {
    tasks: await database.tasks.toArray(),
    todoListItems: await database.todoListItems.toArray()
  }
  return data
}

const Settings = () => {
  const { dispatch } = useContext(context)
  const [restoreFile, setRestoreFile] = useState<File | null>(null)

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
    dispatch({ type: 'RESTORE_STARTED' })
    if (restoreFile) {
      const reader = new FileReader()
      reader.readAsText(restoreFile, 'UTF-8')
      reader.onload = async function (event) {
        try {
          if (event.target?.result) {
            const { todoListItems, tasks } = JSON.parse(event.target.result as string)

            await Promise.all([
              database.tasks.clear(),
              database.todoListItems.clear()
            ])

            await Promise.all([
              database.tasks.bulkAdd(tasks),
              database.todoListItems.bulkAdd(todoListItems)
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
        }
      }
    }
    dispatch({ type: 'RESTORE_ENDED' })
  }, [dispatch])

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
        <Button fullWidth variant='contained' onClick={handleBackup}>Create Backup</Button>

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
