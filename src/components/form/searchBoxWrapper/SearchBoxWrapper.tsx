import { Box } from "@mui/material";
import ResetButton from "components/render/buttons/ResetButton";
import SearchButton from "components/render/buttons/SearchButton";
import React from "react";

type Props = {
  submitHandler: (param: any) => any;
  children: string | JSX.Element | JSX.Element[];
  onReset: () => void;
};

const SearchBoxWrapper: React.FC<Props> = ({ submitHandler, children, onReset }) => {
  return (
    <Box component="form" onSubmit={submitHandler} sx={{ boxShadow: "0px 0px 4px 0px", p: 2, borderRadius: 1, mb: 2 }}>
      {children}
      <SearchButton
        sxProps={{ mt: 3 }}
        buttonProps={{
          type: "submit",
        }}
      />
      <ResetButton
        sxProps={{ ml: 3, mt: 3 }}
        buttonProps={{
          onClick: onReset,
        }}
      />
    </Box>
  );
};

export default SearchBoxWrapper;
