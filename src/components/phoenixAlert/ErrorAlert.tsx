import React from "react";
import { Alert, Box, SxProps, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

type Props = {
  text: React.ReactNode | string[];
  sx?: SxProps;
};

const ErrorAlert: React.FC<Props> = ({ text, sx = { my: 2 } }) => {
  const isArray = Array.isArray(text);
  return (
    <Alert variant="standard" icon={<ErrorIcon />} sx={sx} color="error">
      {isArray ? (
        <Box>
          <Typography fontWeight={700} gutterBottom>
            خطا
          </Typography>
          <Box sx={{ m: 0 }} component={"ul"}>
            {text.map((er) => (
              <li key={er}>{er}</li>
            ))}
          </Box>
        </Box>
      ) : (
        text
      )}
    </Alert>
  );
};

export default ErrorAlert;
