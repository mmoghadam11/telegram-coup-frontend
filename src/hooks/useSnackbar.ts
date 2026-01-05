import { TSnackbar, snackbarContext } from "context/SnackbarContext";
import React from "react";

export function useSnackbar(): TSnackbar {
  const context = React.useContext(snackbarContext);
  if (context === undefined) {
    throw new Error(`useSnackbar must be used within a Provider`);
  }
  return context;
}
