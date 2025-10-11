import { Box, Button, Typography } from "@mui/material";
import moment from "moment";
import { useCallback, useState } from "react";

import { database } from "../database";
import { saveFile } from "../utilities";
import { DATE_BACKUP_DATE } from "../../shared/utilities";
import { activeModalSignal, isRestoringSignal } from "../signals";
import Modal from "./Modal";
import { ModalID } from "./RenderModal";

const copyIndexedDBToObject = async () => {
  const data = {
    tasks: await database.tasks.toArray(),
    todoLists: await database.todoList.toArray(),
  };
  return data;
};

const Settings = () => {
  const [restoreFile, setRestoreFile] = useState<File | null>(null);

  const handleBackup = async () => {
    const backupData = await copyIndexedDBToObject();
    if (!backupData) {
      activeModalSignal.value = {
        id: ModalID.CONFIRMATION_MODAL,
        title: "Something went wrong",
        body: "There is no data to backup",
      };
    } else {
      const backupDate = moment().format(DATE_BACKUP_DATE);
      void saveFile(`${backupDate}.json`, backupData);
    }
  };

  const restore = useCallback((restoreFile: File | null) => {
    isRestoringSignal.value = true;
    if (restoreFile) {
      const reader = new FileReader();
      reader.readAsText(restoreFile, "UTF-8");
      reader.onload = async function (event) {
        try {
          if (event.target?.result) {
            const { todoLists, tasks } = JSON.parse(
              event.target.result as string
            );

            await Promise.all([
              database.tasks.clear(),
              database.todoList.clear(),
            ]);

            await Promise.all([
              database.tasks.bulkAdd(tasks),
              database.todoList.bulkAdd(todoLists),
            ]);
          } else {
            activeModalSignal.value = {
              id: ModalID.CONFIRMATION_MODAL,
              title: "Something went Wrong",
              body: "Please select a valid backup file and try again",
            };
          }
        } catch (error) {
          activeModalSignal.value = {
            id: ModalID.CONFIRMATION_MODAL,
            title: "Something went Wrong",
            body: "Please select a valid backup file and try again",
          };
          isRestoringSignal.value = false;
        }
      };
    }
    isRestoringSignal.value = false;
  }, []);

  const handleRestoreClick = useCallback(() => {
    activeModalSignal.value = {
      id: ModalID.CONFIRMATION_MODAL,
      title: "Restore from Backup?",
      body: "All current data will be lost.",
      confirmationCallback: () => {
        restore(restoreFile);
      },
    };
  }, [restore, restoreFile]);

  return (
    <Modal title="Settings" showModal={true}>
      <Box
        sx={{
          borderRadius: "1rem",
          padding: "1rem",
          margin: "1rem 0",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h3">Backup</Typography>
        </Box>
        <Button fullWidth variant="outlined" onClick={handleBackup}>
          Create Backup
        </Button>
      </Box>

      <Box
        sx={{
          borderRadius: "1rem",
          padding: "1rem",
          margin: "1rem 0",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h3">Restore</Typography>
        <Button variant="outlined" component="label" fullWidth>
          Choose File
          <input
            onChange={(event) => {
              event.target.files && setRestoreFile(event.target.files[0]);
            }}
            type="file"
            hidden
          />
        </Button>
        <Typography
          sx={{
            margin: "0.5rem 0",
          }}
          variant="body1"
        >
          Filename: {restoreFile ? restoreFile.name : ""}
        </Typography>
        <Button
          disabled={!restoreFile}
          onClick={handleRestoreClick}
          fullWidth
          variant="outlined"
        >
          Restore
        </Button>
      </Box>
    </Modal>
  );
};

export default Settings;
