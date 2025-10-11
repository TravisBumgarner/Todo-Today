import { Box, Button, Typography } from "@mui/material";
import { useCallback } from "react";

import { activeModalSignal } from "../signals";
import { SPACING } from "../styles/consts";
import Modal from "./Modal";
import { type ModalID } from "./RenderModal";

export interface ConfirmationModalProps {
  id: ModalID;
  title: string;
  body: string;
  confirmationCallback?: () => void;
  cancelCallback?: () => void;
}

const ConfirmationModal = ({
  title,
  body,
  confirmationCallback,
}: ConfirmationModalProps) => {
  const handleCancel = useCallback(() => {
    activeModalSignal.value = null;
  }, []);

  const handleConfirm = useCallback(() => {
    confirmationCallback?.();
    activeModalSignal.value = null;
  }, [confirmationCallback]);

  return (
    <Modal title={title} showModal={true}>
      <Typography variant="body1">{body}</Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: SPACING.SMALL.PX,
        }}
      >
        <Button variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          Ok
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
