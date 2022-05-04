import React from 'react'
import moment from 'moment'
import { useLiveQuery } from 'dexie-react-hooks'

import { Button, ButtonWrapper, Heading, LabelAndInput, Paragraph } from 'sharedComponents'
import { saveFile } from 'utilities'
import database from 'database'

const Backups = () => {
    const [restore, setRestore] = React.useState<File | null>(null)


    const handleBackup = async () => {
        const data = {
            projects: await database.projects.toArray(),
            tasks: await database.tasks.toArray(),
            todoListItems: await database.todoListItems.toArray(),
        }

        if (!data) {
            alert("go make some data first")
        } else {
            saveFile(`${moment().toISOString()}.json`, data)
        }
    }


    const handleRestore = () => {
        if (restore) {
            const reader = new FileReader();
            reader.readAsText(restore, "UTF-8");
            reader.onload = async function (event) {
                if (event.target && event.target.result) {
                    const newStore = JSON.parse(event.target.result as string)
                    
                    await Promise.all([
                        database.projects.clear(),
                        database.tasks.clear(),
                        database.todoListItems.clear(),
                    ])

                    await Promise.all([
                        database.projects.bulkAdd(newStore.projects),
                        database.tasks.bulkAdd(newStore.tasks),
                        database.todoListItems.bulkAdd(newStore.todoListItems)
                    ])

                    setRestore(null)


                } else {
                    alert("Invalid backup.")
                }
            }
        }
    }

    return (
        <div>
            <Heading.H2>Backup</Heading.H2>
            <Paragraph>Create a copy of the entire database.</Paragraph>
            <ButtonWrapper fullWidth={<Button onClick={() => handleBackup()} fullWidth variation='PRIMARY_BUTTON'>Backup</Button>} />
            <Heading.H2>Restore</Heading.H2>
            <Paragraph>Restore database with a backup copy.</Paragraph>
            <LabelAndInput  handleChange={(file) => setRestore(file)} label="Select a Backup" name={"file"} inputType='file' />
            <ButtonWrapper fullWidth={<Button disabled={!restore} onClick={() => handleRestore()} fullWidth variation='PRIMARY_BUTTON'>Restore from Backup</Button>} />
        </div>
    )
}

export default Backups
