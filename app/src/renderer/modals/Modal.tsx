import CloseIcon from "@mui/icons-material/CloseOutlined";
import { IconButton, Tooltip, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import MUIModal from "@mui/material/Modal";
import { useCallback, type FC } from "react";
import { activeModalSignal } from "../signals";
import { BORDER_RADIUS, SPACING } from "../styles/consts";

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
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          width: 500,
          bgcolor: "background.default",
          borderRadius: BORDER_RADIUS.ZERO.PX,
          boxShadow: 24,
          overflow: "auto",
          padding: SPACING.MEDIUM.PX,
          boxSizing: "border-box",
          maxHeight: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: SPACING.MEDIUM.PX,
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
