import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, Button, type SxProps } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { useSignals } from "@preact/signals-react/runtime";
import { motion } from "framer-motion";
import { useCallback } from "react";

import { messageSignal } from "../signals";
import { SPACING } from "../styles/consts";

type Severity = "error" | "warning" | "info" | "success";

const SEVERITY_ICON: Record<Severity, typeof InfoOutlinedIcon> = {
  error: ErrorOutlineIcon,
  warning: WarningAmberIcon,
  info: InfoOutlinedIcon,
  success: CheckCircleOutlineIcon,
};

const severityColor = (theme: Theme, severity: Severity) => {
  switch (severity) {
    case "error":
      return theme.palette.error.main;
    case "warning":
      return theme.palette.warning.main;
    case "success":
      return theme.palette.secondary.main;
    default:
      return theme.palette.primary.main;
  }
};

const Alert = () => {
  useSignals();
  const theme = useTheme();

  const handleCancel = useCallback(() => {
    messageSignal.value = null;
  }, []);

  const handleConfirm = useCallback(() => {
    messageSignal.value = null;
  }, []);

  if (messageSignal.value === null) return null;

  const { text, severity, cancelText, confirmText } = messageSignal.value;
  const Icon = SEVERITY_ICON[severity];
  const accent = severityColor(theme, severity);

  return (
    <Box sx={positionerSx}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        role="status"
        sx={snackbarSx(theme)}
      >
        <Icon sx={{ color: accent, fontSize: 20, flexShrink: 0 }} />
        <Box component="span" sx={messageTextSx}>
          {text}
        </Box>
        <Box sx={{ display: "flex", gap: SPACING.TINY.PX, flexShrink: 0 }}>
          {cancelText ? (
            <Button color="secondary" variant="text" size="small" onClick={handleCancel}>
              {cancelText}
            </Button>
          ) : null}
          <Button color="primary" size="small" variant="outlined" onClick={handleConfirm}>
            {confirmText ?? "Close"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Alert;

const positionerSx: SxProps = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  justifyContent: "center",
  padding: SPACING.MEDIUM.PX,
  pointerEvents: "none",
};

const snackbarSx = (theme: Theme): SxProps<Theme> => ({
  pointerEvents: "auto",
  display: "flex",
  alignItems: "center",
  gap: SPACING.SMALL.PX,
  minWidth: 320,
  maxWidth: 520,
  padding: "8px 8px 8px 14px",
  bgcolor: theme.app.panel,
  color: "text.primary",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: `${theme.shape.borderRadius}px`,
  boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
});

const messageTextSx: SxProps = {
  flex: 1,
  minWidth: 0,
  fontSize: "13px",
  lineHeight: 1.4,
  color: "text.primary",
};
