import { Alert as AlertMUI, Box, Button, SxProps } from "@mui/material";
import { useCallback } from "react";

import { useSignals } from "@preact/signals-react/runtime";
import { messageSignal } from "../signals";
import { BORDER_RADIUS, SPACING } from "../styles/consts";

const Alert = () => {
  useSignals();
  const handleCancel = useCallback(() => {
    messageSignal.value = null;
  }, []);

  const handleConfirm = useCallback(() => {
    messageSignal.value = null;
  }, []);

  if (messageSignal.value === null) return null;

  return (
    <Box sx={AlertPositionerCSS}>
      <AlertMUI
        variant="filled"
        sx={AlertMuiCSS}
        action={
          <>
            {messageSignal.value.cancelText ? (
              <Button
                color="secondary"
                variant="outlined"
                size="small"
                onClick={handleCancel}
              >
                {messageSignal.value.cancelText
                  ? messageSignal.value.cancelText
                  : "Cancel"}
              </Button>
            ) : null}
            <Button
              color="primary"
              size="small"
              variant="outlined"
              onClick={handleConfirm}
            >
              {messageSignal.value.confirmText
                ? messageSignal.value.confirmText
                : "Close"}
            </Button>
          </>
        }
        color="info"
      >
        {messageSignal.value.text}
      </AlertMUI>
    </Box>
  );
};

export default Alert;

const AlertMuiCSS: SxProps = {
  display: "flex",
  alignItems: "center",
  borderRadius: BORDER_RADIUS.ZERO.PX,
  backgroundColor: "background.paper",
};

const AlertPositionerCSS: SxProps = {
  position: "fixed",
  left: 0,
  bottom: 0,
  width: "100%",
  display: "flex",
  justifyContent: "center",
  marginBottom: SPACING.MEDIUM.PX,
};
