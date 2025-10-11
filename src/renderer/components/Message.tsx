import { css } from "@emotion/react";
import { Alert as AlertMUI, Box, Button } from "@mui/material";
import { useCallback } from "react";

import { useSignals } from "@preact/signals-react/runtime";
import ButtonWrapper from "./ButtonWrapper";
import { messageSignal } from "../signals";

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
          <ButtonWrapper>
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
          </ButtonWrapper>
        }
        color="info"
      >
        {messageSignal.value.text}
      </AlertMUI>
    </Box>
  );
};

export default Alert;

const AlertMuiCSS = css`
  display: flex;
  align-items: center;
`;

const AlertPositionerCSS = css`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;
