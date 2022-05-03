import React from 'react'
import moment from 'moment'

import { Button, ButtonWrapper, Heading, LabelAndInput, Paragraph } from 'sharedComponents'
// import { context } from 'Context'
import { saveFile } from 'utilities'

const Backups = () => {
    // const { state, dispatch } = React.useContext(context)
    const [backup, setBackup] = React.useState<File | null>(null)

    return <p>Backup</p>

    // const handleBackup = () => {
    //     saveFile(`${moment().toISOString()}.json`, state)
    // }

    // const handleRestore = () => {
    //     if (backup) {
    //         const reader = new FileReader();
    //         reader.readAsText(backup, "UTF-8");
    //         reader.onload = function (event) {
    //             if (event.target && event.target.result) {
    //                 const newStore = JSON.parse(event.target.result as string)
    //                 dispatch({ type: "HYDRATE_APP", payload: newStore })
    //             } else {
    //                 alert("Invalid backup.")
    //             }
    //         }
    //     }
    // }

    // return (
    //     <div>
    //         <Heading.H2>Backup</Heading.H2>
    //         <Paragraph>Create a copy of the entire database.</Paragraph>
    //         <ButtonWrapper fullWidth={<Button onClick={() => handleBackup()} fullWidth variation='PRIMARY_BUTTON'>Backup</Button>} />
    //         <Heading.H2>Restore</Heading.H2>
    //         <Paragraph>Restore database with a backup copy.</Paragraph>
    //         <LabelAndInput handleChange={(file) => setBackup(file)} label="Select a Backup" name={"file"} inputType='file' />
    //         <ButtonWrapper fullWidth={<Button disabled={!backup} onClick={() => handleRestore()} fullWidth variation='PRIMARY_BUTTON'>Restore from Backup</Button>} />
    //     </div>
    // )
}

export default Backups
