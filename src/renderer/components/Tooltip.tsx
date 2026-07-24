import { Tooltip as MUITooltip, type TooltipProps } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

// How long a tooltip stays up before it dismisses itself, even while the
// pointer is still hovering. Scales with the message so a one-word label
// disappears quickly and a full sentence sticks around long enough to read.
const MIN_MS = 2000;
const MAX_MS = 8000;
const autoDismissMs = (title: TooltipProps["title"]) => {
  const len = typeof title === "string" ? title.length : 24;
  return Math.min(MAX_MS, Math.max(MIN_MS, 400 + len * 90));
};

/**
 * Drop-in replacement for MUI's Tooltip that auto-dismisses after a delay
 * proportional to the message length. MUI keeps a tooltip open for as long as
 * the pointer rests on the target; this closes it on a timer instead.
 */
const Tooltip = ({ title, onOpen, onClose, ...rest }: TooltipProps) => {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const handleOpen = useCallback(
    (event: React.SyntheticEvent) => {
      onOpen?.(event);
      setOpen(true);
      clear();
      timer.current = setTimeout(() => setOpen(false), autoDismissMs(title));
    },
    [onOpen, title, clear]
  );

  const handleClose = useCallback(
    (event: React.SyntheticEvent | Event) => {
      onClose?.(event);
      clear();
      setOpen(false);
    },
    [onClose, clear]
  );

  useEffect(() => clear, [clear]);

  return (
    <MUITooltip
      {...rest}
      title={title}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
    />
  );
};

export default Tooltip;
