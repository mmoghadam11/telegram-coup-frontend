import { Box, Button, CircularProgress } from "@mui/material";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WestIcon from "@mui/icons-material/West";
import { ArrowBack, East, ExitToApp } from "@mui/icons-material";

type Props = {
  onSave?: () => void;
  isLoading?: boolean;
  onBack?: () => void;
  onExit?:  () => void;
  onSaveDisabled?: boolean;
};

const FormButtons: React.FC<Props> = ({ onExit, onBack, onSave, isLoading, onSaveDisabled=false }) => {
  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "row" }}>
      {onExit && (
        <Button
          variant="contained"
          onClick={() => onExit()}
          startIcon={<ExitToApp fontSize="small"/>}
          color="error"
          sx={{ mx: 1 }}
          size='small'
        >
          خروج
        </Button>
      )}
      {onBack && (
        <Button
          variant="contained"
          onClick={() => onBack()}
          startIcon={<East fontSize="small"/>}
          color="info"
          sx={{ mx: 1 }}
          size='small'
        >
          مرحله قبل
        </Button>
      )}
      {onSave && (
        <Button
          disabled={isLoading || onSaveDisabled}
          variant="contained"
          onClick={() => onSave()}
          endIcon={isLoading ? <CircularProgress size={14} /> : <ArrowBack fontSize="small"/>}
          color="success"
          sx={{ mx: 1 }}
          size='small'
        >
          مرحله بعد
        </Button>
      )}
    </Box>
  );
};

export default FormButtons;
