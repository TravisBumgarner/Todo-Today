import BlockIcon from "@mui/icons-material/Block";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import type { Theme } from "@mui/material/styles";
import { ETaskStatus } from "../types";

// A consistent circle-based family. Each icon defaults to the theme's per-status
// color, but accepts an explicit `color` (e.g. "#fff" on a colored status badge).
interface IconProps {
  color?: string;
}

const tint = (status: ETaskStatus, color?: string) =>
  color ?? ((theme: Theme) => theme.app.statusColors[status]);

export const NewIcon = ({ color }: IconProps) => (
  <RadioButtonUncheckedIcon fontSize="small" sx={{ color: tint(ETaskStatus.NEW, color) }} />
);

export const InProgressIcon = ({ color }: IconProps) => (
  <TimelapseIcon fontSize="small" sx={{ color: tint(ETaskStatus.IN_PROGRESS, color) }} />
);

export const CompletedIcon = ({ color }: IconProps) => (
  <CheckCircleIcon fontSize="small" sx={{ color: tint(ETaskStatus.COMPLETED, color) }} />
);

export const CanceledIcon = ({ color }: IconProps) => (
  <CancelIcon fontSize="small" sx={{ color: tint(ETaskStatus.CANCELED, color) }} />
);

export const BlockedIcon = ({ color }: IconProps) => (
  <BlockIcon fontSize="small" sx={{ color: tint(ETaskStatus.BLOCKED, color) }} />
);

export default {
  CanceledIcon,
  BlockedIcon,
  CompletedIcon,
  InProgressIcon,
  NewIcon,
};
