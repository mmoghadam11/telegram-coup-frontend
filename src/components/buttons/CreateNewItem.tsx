import { Button, Fab, Tooltip } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { isMobile } from "react-device-detect";
import { Add } from "@mui/icons-material";

type Props = {
  icon?: React.ReactElement;
  name?: string;
  url?: string;
  onClick?:any;
  title?:string;
  sx?:any
};

const CreateNewItem: React.FC<Props> = ({ icon, name,title, url,onClick,sx}) => {
  const navigate = useNavigate();
  if(!isMobile)
  return (
    <Button
      variant="contained"
      endIcon={icon || <AddCircleIcon />}
      onClick={() => {onClick ? onClick() : navigate(url || "new");}}
      color="info"
      sx={{ ...sx,minWidth: "100px", mb: 2 }}
    >
     {!!title?title:`ایجاد ${name} جدید`} 
    </Button>
  );
  else return(
    <Tooltip title={`ایجاد ${name} جدید`}>
        <Fab
          size="small"
          onClick={() => {onClick ? onClick() : navigate(url || "new");}}
          color="info"
          sx={{ ...sx, mb: 2 }}
        >
          {icon || <Add />}
        </Fab>
      </Tooltip>
  )
};

export default CreateNewItem;
