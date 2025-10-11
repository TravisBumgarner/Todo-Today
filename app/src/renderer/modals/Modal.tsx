import CloseIcon from "@mui/icons-material/CloseOutlined";
import { IconButton, Tooltip, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import MUIModal from "@mui/material/Modal";
import { useCallback, type FC } from "react";
import { activeModalSignal } from "../signals";

interface ActiveModal {
  children: React.ReactNode;
  showModal: boolean;
  title: string;
  disableEscapeKeyDown?: boolean;
  disableBackdropClick?: boolean;
}

export const MODAL_MAX_HEIGHT = 800;

const Modal: FC<ActiveModal> = ({
  children,
  title,
  disableEscapeKeyDown,
  disableBackdropClick,
}) => {
  const handleClose = useCallback(
    (event?: any, reason?: "backdropClick" | "escapeKeyDown") => {
      if (reason === "backdropClick" && disableBackdropClick) return;
      activeModalSignal.value = null;
    },
    [disableBackdropClick]
  );

  return (
    <MUIModal
      open={true}
      onClose={handleClose}
      disableEscapeKeyDown={disableEscapeKeyDown}
      disableRestoreFocus={true}
      sx={{
        maxHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <Box
        sx={{
          width: 600,
          bgcolor: "background.default",
          borderRadius: "1rem",
          boxShadow: 24,
          overflow: "auto",
          padding: "2rem",
          boxSizing: "border-box",
          maxHeight: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h2">{title}</Typography>
          <Tooltip title="Close">
            <IconButton onClick={handleClose}>
              <CloseIcon sx={{ color: "text.primary" }} />
            </IconButton>
          </Tooltip>
        </Box>
        {children}
      </Box>
    </MUIModal>
  );
};

export default Modal;
