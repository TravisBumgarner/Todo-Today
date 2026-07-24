import CloseIcon from "@mui/icons-material/CloseOutlined";
import { IconButton, Tooltip, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import MUIModal from "@mui/material/Modal";
import { motion } from "framer-motion";
import React, { useCallback, type FC } from "react";
import { activeModalSignal } from "../signals";
import { BORDER_RADIUS, SPACING } from "../styles/consts";

interface ActiveModal {
  children: React.ReactNode;
  showModal: boolean;
  title: string;
  disableEscapeKeyDown?: boolean;
  disableBackdropClick?: boolean;
  styles?: React.CSSProperties;
}

export const MODAL_MAX_HEIGHT = 800;

const Modal: FC<ActiveModal> = ({
  children,
  title,
  disableEscapeKeyDown,
  disableBackdropClick,
  styles,
}) => {
  const close = useCallback(() => {
    activeModalSignal.value = null;
  }, []);

  // Escape key still routes through MUI's onClose; the backdrop click is
  // handled by the animated overlay below.
  const handleClose = useCallback(
    (_event: unknown, reason?: "backdropClick" | "escapeKeyDown") => {
      if (reason === "escapeKeyDown" && disableEscapeKeyDown) return;
      close();
    },
    [disableEscapeKeyDown, close]
  );

  const handleBackdropClick = useCallback(() => {
    if (disableBackdropClick) return;
    close();
  }, [disableBackdropClick, close]);

  return (
    <MUIModal
      open={true}
      onClose={handleClose}
      disableEscapeKeyDown={disableEscapeKeyDown}
      disableRestoreFocus={true}
      // We render our own animated backdrop so it fades in/out with the
      // content instead of flashing in instantly.
      hideBackdrop={true}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        onClick={handleBackdropClick}
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          boxSizing: "border-box",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -12 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onClick={(event) => event.stopPropagation()}
          style={{
            width: 500,
            borderRadius: 0,
            boxShadow:
              "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)",
            overflow: "auto",
            boxSizing: "border-box",
            maxHeight: "100%",
            ...styles,
          }}
        >
          <Box
            sx={{
              padding: SPACING.SMALL.PX,
              bgcolor: "background.default",
              borderRadius: BORDER_RADIUS.ZERO.PX,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: SPACING.SMALL.PX,
              }}
            >
              <Typography variant="h2">{title}</Typography>
              <Tooltip title="Close">
                <IconButton onClick={close}>
                  <CloseIcon sx={{ color: "text.primary" }} />
                </IconButton>
              </Tooltip>
            </Box>
            {children}
          </Box>
        </motion.div>
      </motion.div>
    </MUIModal>
  );
};

export default Modal;
