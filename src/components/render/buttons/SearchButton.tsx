import { Button, ButtonProps, CircularProgress, SxProps } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
  isLoading?: boolean;
  sxProps?: SxProps;
  buttonProps?: ButtonProps;
};

const SearchButton: React.FC<Props> = ({ isLoading = false, buttonProps, sxProps }) => {
  return (
    <Button
      variant="contained"
      disabled={isLoading}
      endIcon={isLoading ? <CircularProgress size={12} /> : <SearchIcon />}
      sx={{ ...sxProps }}
      {...buttonProps}
    >
      جستجو
    </Button>
  );
};

export default SearchButton;
