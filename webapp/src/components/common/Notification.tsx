import React from "react";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface ToastNotificationProps {
  open: boolean;
  message: string;
  severity: "success" | "error";
  onClose: () => void;
  autoHideDuration?: number;
  anchorOrigin?: SnackbarOrigin;
}

export default function Notification({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 6000,
  anchorOrigin = { vertical: "bottom", horizontal: "right" },
}: ToastNotificationProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "80%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
