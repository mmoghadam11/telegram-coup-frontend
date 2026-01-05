import { RefreshOutlined } from "@mui/icons-material";
import { IconButton, LinearProgress } from "@mui/material";
import { QueryStatus } from "@tanstack/react-query";
import React from "react";

type Props = {
  status: QueryStatus;
  refetch: () => void;
  renderValue: any;
};

const RenderGridStatus: React.FC<Props> = ({ status, refetch, renderValue }) => {
  if (status === "loading") return <LinearProgress />;
  if (status === "error")
    return (
      <IconButton color="error" onClick={refetch}>
        <RefreshOutlined />
      </IconButton>
    );
  return renderValue;
};

export default RenderGridStatus;
