import React from "react";
import { IconProps } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

type Props = {
  value: boolean;
  fontSize?: IconProps["fontSize"];
};

const RenderBoolean: React.FC<Props> = ({ value, fontSize = "medium" }) => {
  if (value) {
    return <CheckCircleOutlineOutlinedIcon fontSize={fontSize} color="success" />;
  }
  return <BlockIcon fontSize={fontSize} color="error" />;
};

export default RenderBoolean;
