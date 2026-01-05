import { Alert, Snackbar } from "@mui/material";
import React, { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

export type TSnackbar = (message: string, variant: keyof typeof variantIcon) => void;

export const snackbarContext = React.createContext<TSnackbar | undefined>(undefined);

export const SnackbarProvider = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string>();
  const [variant, setVariant] = useState<keyof typeof variantIcon>("info");

  const openSnackbar = (message: string, variant: keyof typeof variantIcon) => {
    setIsOpen(true);
    setMessage(message);
    setVariant(variant);
  };

  const closeSnackbar = () => {
    setIsOpen(false);
  };

  const { children } = props;

  return (
    <snackbarContext.Provider value={openSnackbar}>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={isOpen}
        autoHideDuration={6000}
        onClose={closeSnackbar}
      >
        <Alert
          onClose={closeSnackbar}
          severity={variant}
          sx={{ minWidth: "300px", border: (theme) => `1px solid ${theme.palette[variant].main}` }}
        >
          {message}
        </Alert>
      </Snackbar>
      {children}
    </snackbarContext.Provider>
  );
};

export const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

export interface PhoenixSnackbarProps {
  className?: string;
  message?: string;
  onClose?: () => void;
  variant: keyof typeof variantIcon;
}
