import { Button, ButtonProps, SxProps } from "@mui/material";
import React from "react";
import ClearAllIcon from "@mui/icons-material/ClearAll";

type Props = {
  sxProps?: SxProps;
  buttonProps?: ButtonProps;
};

const ResetButton: React.FC<Props> = ({ buttonProps, sxProps }) => {
  return (
    <Button variant="outlined" color="warning" endIcon={<ClearAllIcon />} sx={{ ...sxProps }} {...buttonProps}>
      بازنشانی
    </Button>
  );
};

export default ResetButton;
