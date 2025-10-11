import { Button, Typography } from "@mui/material";
import { useCallback } from "react";

import ButtonWrapper from "../components/ButtonWrapper";
import { activeModalSignal } from "../signals";
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
      <ButtonWrapper>
        <Button
          variant="outlined"
          color="warning"
          fullWidth
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button variant="contained" fullWidth onClick={handleConfirm}>
          Ok
        </Button>
      </ButtonWrapper>
    </Modal>
  );
};

export default ConfirmationModal;
