import { Button, Fab, Tooltip } from "@mui/material";
import React from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import { isMobile } from "react-device-detect";

type Props = {
  onBack: () => void;
  text?: string;
  sx?: any;
};

const BackButton: React.FC<Props> = ({ onBack, text = "بازگشت", sx }) => {
  if (!isMobile)
    return (
      <Button
        variant="outlined"
        onClick={() => onBack()}
        endIcon={<ReplyIcon />}
        color="warning"
        sx={{ ...sx, minWidth: "150px", mb: 2 }}
      >
        بازگشت
      </Button>
    );
  else
    return (
      <Tooltip title="بازگشت">
        <Fab
          size="small"
          onClick={() => onBack()}
          color="warning"
          sx={{ ...sx, mb: 2 }}
        >
          <ReplyIcon />
        </Fab>
      </Tooltip>
    );
};

export default BackButton;
