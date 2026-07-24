import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  SxProps,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { useSignals } from "@preact/signals-react/runtime";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";

import { CHANNEL_INVOKES } from "../../shared/types";
import { DATE_BACKUP_DATE } from "../../shared/utilities";
import { database } from "../database";
import ipcMessenger from "../ipcMessenger";
import { activeModalSignal, densitySignal, isRestoringSignal, themeSignal } from "../signals";
import { SPACING } from "../styles/consts";
import { type EDensity, type EThemeId, THEME_LIST } from "../styles/themes";
import { saveFile } from "../utilities";
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
  useSignals();
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [showInMenuBar, setShowInMenuBar] = useState(false);
  const isMac = navigator.userAgent.includes("Macintosh");

  const handleThemeChange = useCallback((id: EThemeId) => {
    themeSignal.value = id;
    void ipcMessenger.invoke(CHANNEL_INVOKES.STORE.SET, { theme: id });
  }, []);

  const handleDensityChange = useCallback((value: EDensity) => {
    densitySignal.value = value;
    void ipcMessenger.invoke(CHANNEL_INVOKES.STORE.SET, { density: value });
  }, []);

  const showChangelog = useCallback(() => {
    activeModalSignal.value = { id: ModalID.CHANGELOG_MODAL };
  }, []);

  useEffect(() => {
    ipcMessenger
      .invoke(CHANNEL_INVOKES.STORE.GET, undefined)
      .then(({ showInMenuBar }) => {
        setShowInMenuBar(showInMenuBar);
      });
  }, []);

  const handleShowInMenuBarChange = useCallback((value: boolean) => {
    setShowInMenuBar(value);
    void ipcMessenger.invoke(CHANNEL_INVOKES.STORE.SET, {
      showInMenuBar: value,
    });
  }, []);

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
        sx={{ display: "flex", flexDirection: "column", gap: SPACING.TINY.PX }}
      >
        <Box sx={sectionSx}>
          <Typography variant="h3" sx={headerSx}>
            Theme
          </Typography>
          <Box sx={themeGridSx}>
            {THEME_LIST.map((t) => {
              const selected = themeSignal.value === t.id;
              return (
                <Box
                  key={t.id}
                  component="button"
                  type="button"
                  onClick={() => handleThemeChange(t.id)}
                  aria-pressed={selected}
                  title={t.blurb}
                  sx={themeSwatchSx(selected)}
                >
                  <Box sx={{ display: "flex" }}>
                    {t.swatches.map((c, i) => (
                      <Box
                        key={c}
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "3px",
                          bgcolor: c,
                          marginLeft: i === 0 ? 0 : "-5px",
                          border: "1.5px solid rgba(0,0,0,0.15)",
                        }}
                      />
                    ))}
                  </Box>
                  <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                    {t.name}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          <Typography
            variant="h3"
            sx={{ ...headerSx, marginTop: SPACING.SMALL.PX }}
          >
            Density
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={densitySignal.value}
            onChange={(_e, value) => value && handleDensityChange(value)}
          >
            <ToggleButton value="compact">Compact</ToggleButton>
            <ToggleButton value="comfortable">Comfortable</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={sectionSx}>
          <Typography variant="h3" sx={headerSx}>
            Window
          </Typography>
          <FormControlLabel
            disabled={!isMac}
            sx={{ margin: 0 }}
            control={
              <Switch
                checked={showInMenuBar}
                onChange={(event) =>
                  handleShowInMenuBarChange(event.target.checked)
                }
              />
            }
            label="Show in menu bar"
          />
          <Typography variant="body2" sx={{ mt: SPACING.TINY.PX }}>
            {isMac
              ? "Runs from the menu bar — click the status-bar icon to open, click away to hide."
              : "Only available on macOS."}
          </Typography>
        </Box>

        <Box sx={sectionSx}>
          <Typography variant="h3" sx={headerSx}>
            Data
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: SPACING.TINY.PX }}>
            <Button variant="outlined" onClick={handleBackup}>
              Create Backup
            </Button>
            <Button variant="outlined" component="label">
              Choose File
              <input
                onChange={(event) => {
                  event.target.files && setRestoreFile(event.target.files[0]);
                }}
                type="file"
                hidden
              />
            </Button>
            <Button
              disabled={!restoreFile}
              onClick={handleRestoreClick}
              variant="outlined"
            >
              Restore
            </Button>
            <Button variant="text" onClick={showChangelog}>
              Changelog
            </Button>
          </Box>
          {restoreFile ? (
            <Typography variant="body2" sx={{ mt: SPACING.TINY.PX }}>
              Selected: {restoreFile.name}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Modal>
  );
};

const sectionSx: SxProps<Theme> = (theme) => ({
  borderRadius: `${theme.shape.borderRadius}px`,
  padding: SPACING.SMALL.PX,
  bgcolor: theme.app.panel,
  border: `1px solid ${theme.palette.divider}`,
});

const headerSx: SxProps = {
  marginBottom: SPACING.TINY.PX,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontSize: "11px",
  opacity: 0.75,
};

const themeGridSx: SxProps = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: SPACING.TINY.PX,
};

const themeSwatchSx = (selected: boolean): SxProps => ({
  display: "flex",
  alignItems: "center",
  gap: SPACING.TINY.PX,
  padding: "6px 8px",
  cursor: "pointer",
  textAlign: "left",
  color: "text.primary",
  bgcolor: "background.default",
  border: "2px solid",
  borderColor: selected ? "primary.main" : "divider",
  borderRadius: 1,
  transition: "border-color 0.15s",
});

export default Settings;
