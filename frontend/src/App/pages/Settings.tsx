import React from 'react'
import moment from 'moment'

import database from 'database'
import { EColorTheme, EBackupInterval } from 'sharedTypes'
import { Button, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import {
    ConfirmationModal,
    Modal,
    PageHeader
} from 'sharedComponents'
import {
    colorThemeOptionLabels,
    saveFile,
    getLocalStorage,
    setLocalStorage,
    backupIntervalLookup
} from 'utilities'
import { context } from 'Context'
import { type BackupIPC } from '../../../../shared/types'

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

const runAutomatedBackup = (showAutomatedBackupFailedModal: React.Dispatch<React.SetStateAction<boolean>>) => {
    void createBackup().then(async (data) => {
        const response = await ipcRenderer.invoke(
            'backup',
            { filename: `${moment().toISOString()}.json`, data: JSON.stringify(data) } as BackupIPC
        )
        if (response.isSuccess === true) {
            setLocalStorage('lastBackup', moment().toLocaleString())
        } else {
            showAutomatedBackupFailedModal(true)
        }
    })
}

const createNewBackupInterval = (
    showAutomatedBackupFailedModal: React.Dispatch<React.SetStateAction<boolean>>,
    backupIntervalInMilliseconds: number
) => {
    clearInterval(window.automatedBackupIntervalId)
    window.automatedBackupIntervalId = setInterval(() => {
        runAutomatedBackup(showAutomatedBackupFailedModal)
    }, backupIntervalInMilliseconds)
}

const setupAutomatedBackup = (showAutomatedBackupFailedModal: React.Dispatch<React.SetStateAction<boolean>>) => {
    const backupInterval = getLocalStorage('backupInterval') as EBackupInterval
    if (backupInterval === EBackupInterval.OFF) {
        return
    }
    const lastBackup = getLocalStorage('lastBackup')

    const lastBackupThreshold = moment()
    lastBackupThreshold.subtract(backupIntervalToMilliseconds[backupInterval], 'milliseconds')

    if (!lastBackup || moment(lastBackup) < lastBackupThreshold) {
        runAutomatedBackup(showAutomatedBackupFailedModal)
    }
    createNewBackupInterval(showAutomatedBackupFailedModal, backupIntervalToMilliseconds[backupInterval])
}

const Settings = () => {
    const { state, dispatch } = React.useContext(context)
    const [restore, setRestore] = React.useState<File | null>(null)
    const [showRestoreConfirmModal, setShowRestoreConfirmModal] = React.useState<boolean>(false)
    const [showNoDataModal, setShowNoDataModal] = React.useState<boolean>(false)
    const [showInvalidBackupModal, setShowInvalidBackupModal] = React.useState<boolean>(false)

    const handleBackup = async () => {
        const data = await createBackup()
        if (!data) {
            setShowNoDataModal(true)
        } else {
            void saveFile(`${moment().toISOString()}.json`, data)
        }
    }

    const handleRestore = () => {
        if (restore) {
            const reader = new FileReader()
            reader.readAsText(restore, 'UTF-8')
            reader.onload = async function (event) {
                if (event?.target?.result) {
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
                    setShowInvalidBackupModal(true)
                }
            }
        }
        setShowRestoreConfirmModal(false)
    }

    const handleSubmit = ({ key, value }: { key: string, value: string }) => {
        dispatch({ type: 'EDIT_USER_SETTING', payload: { key, value } })
    }
    return (
        <div>
            <PageHeader>
                <Typography variant="h2">
                    Settings
                </Typography>
            </PageHeader>
            <Typography variant="h3">User Preferences</Typography>
            <form>

                <InputLabel id="color-theme">Color Theme</InputLabel>
                <Select
                    fullWidth
                    labelId="color-theme"
                    value={state.colorTheme}
                    label="Color Theme"
                    onChange={(event) => { handleSubmit({ key: 'colorTheme', value: event.target.value }) }}
                >
                    {Object.keys(EColorTheme).map(key => <MenuItem key={key} value={key}>{colorThemeOptionLabels[key as EColorTheme]}</MenuItem>)}
                </Select>
            </form>
            <div>
                <Typography variant="h3">Backups</Typography>
                <Button fullWidth variant='contained' onClick={async () => { await handleBackup() }}>Create Backup</Button>

                <InputLabel id="week-start">Week Start</InputLabel>
                <Select
                    fullWidth
                    labelId="backup-interval"
                    value={state.backupInterval}
                    label="Color Theme"
                    onChange={(event) => { dispatch({ type: 'EDIT_USER_SETTING', payload: { key: 'backupInterval', value: event.target.value } }) }}
                >
                    {Object.keys(EBackupInterval).map(key => <MenuItem key={key} value={key}>{backupIntervalLookup[key as EBackupInterval]}</MenuItem>)}
                </Select>
                <Typography variant="body2">Last Backup: {getLocalStorage('lastBackup')}</Typography>
                <Typography variant="body2">Backup Location: {state.backupDir}</Typography>

                <Typography variant="h3">Restore</Typography>
                <form>
                    <label>Restore database with a backup copy.</label>
                    <input
                        onChange={(event) => { event.target.files && setRestore(event.target.files[0]) }}
                        name="file"
                        type="file"
                    />
                    <Button
                        disabled={!restore}
                        onClick={() => { setShowRestoreConfirmModal(true) }}
                        fullWidth
                        variant='contained'
                    >
                        Restore from Backup
                    </Button>
                </form>
                {
                    showRestoreConfirmModal
                        ? (
                            <Modal
                                title="Restore?"
                                showModal={showRestoreConfirmModal}
                                closeModal={() => { setShowRestoreConfirmModal(false) }}
                            >
                                <Typography variant="body1">If you have data you have not created a backup for, please do that first.</Typography>
                                <Typography variant="body1">Clicking restore will erase everything currently stored in the application.</Typography>
                                <Button
                                    key="cancel"
                                    onClick={() => { setShowRestoreConfirmModal(false) }}
                                    type="button"
                                    fullWidth
                                >
                                    Cancel
                                </Button>
                                <Button
                                    fullWidth
                                    key="restore"
                                    type="button"
                                    onClick={() => { handleRestore() }}
                                    variant='contained'
                                >
                                    Restore
                                </Button>
                            </Modal>
                        )
                        : (null)
                }
                <ConfirmationModal
                    body="There is no data to backup."
                    title="Heads Up!"
                    confirmationCallback={() => { setShowNoDataModal(false) }}
                    showModal={showNoDataModal}
                    setShowModal={setShowNoDataModal}
                />
                <ConfirmationModal
                    body="That backup is invalid."
                    title="Heads Up!"
                    confirmationCallback={() => { setShowInvalidBackupModal(false) }}
                    showModal={showInvalidBackupModal}
                    setShowModal={setShowInvalidBackupModal}
                />
            </div>
        </div>
    )
}

export default Settings
export { setupAutomatedBackup }
