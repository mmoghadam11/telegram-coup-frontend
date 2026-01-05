import React from "react";
import { Alert, AlertTitle, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

type Props = {
  onRefetch: () => void;
  errorText?: string;
};

const ErrorHandler: React.FC<Props> = ({ onRefetch, errorText = "خطا در برقراری ارتباط با سرور" }) => {
  return (
    <Alert severity="error">
      <AlertTitle sx={{ fontWeight: 700 }}>{errorText}</AlertTitle>

      <Button onClick={onRefetch} endIcon={<RefreshIcon />} variant="outlined" color="error" size="small">
        تلاش مجدد
      </Button>
    </Alert>
  );
};

export default ErrorHandler;
