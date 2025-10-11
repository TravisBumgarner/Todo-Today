import CloseIcon from "@mui/icons-material/CloseOutlined";
import { IconButton, Tooltip, Typography, css } from "@mui/material";
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
      style={{ backgroundColor: "var(--mui-palette-background-default)" }}
      sx={muiModalCSSWrapper}
    >
      <Box sx={wrapperCSS}>
        <Box sx={headerWrapperCSS}>
          <Typography variant="h2">{title}</Typography>
          <Tooltip title="Close">
            <IconButton onClick={handleClose}>
              <CloseIcon sx={{ color: "var(--mui-palette-text-primary)" }} />
            </IconButton>
          </Tooltip>
        </Box>
        {children}
      </Box>
    </MUIModal>
  );
};

const wrapperCSS = css`
  width: 600px;
  background-color: var(--mui-palette-background-default);
  border-radius: 1rem;
  box-shadow: 24;
  overflow: auto;
  padding: 2rem;
  box-sizing: border-box;
  max-height: 100%;
  overflow: auto;
`;

const headerWrapperCSS = css`
  display: flex;
  justify-content: space-between;
`;

const muiModalCSSWrapper = css`
  max-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

export default Modal;
