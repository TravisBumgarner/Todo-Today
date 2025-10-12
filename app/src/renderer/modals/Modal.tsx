import CloseIcon from "@mui/icons-material/CloseOutlined";
import { IconButton, Tooltip, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import MUIModal from "@mui/material/Modal";
import { motion } from "framer-motion";
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
    (event: unknown, reason?: "backdropClick" | "escapeKeyDown") => {
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
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        style={{
          width: 500,
          borderRadius: 0,
          boxShadow:
            "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)",
          overflow: "auto",
          boxSizing: "border-box",
          maxHeight: "100%",
        }}
      >
        <Box
          sx={{
            padding: SPACING.MEDIUM.PX,
            bgcolor: "background.default",
            borderRadius: BORDER_RADIUS.ZERO.PX,
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
      </motion.div>
    </MUIModal>
  );
};

export default Modal;
