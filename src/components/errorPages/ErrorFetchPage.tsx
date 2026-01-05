import React from "react";
import { ErrorOutline, HomeOutlined } from "@mui/icons-material";
import { Box, Button, Typography, alpha } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ErrorFetchPage = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "600px",
          p: 3,
          backgroundColor: (theme) => alpha(theme.palette.error.light, 0.25),
          border: (theme) => `1px solid ${theme.palette.error.dark}`,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Typography
            variant="body1"
            fontSize={24}
            fontWeight={500}
            sx={{ color: (theme) => theme.palette.error.main, mb: 2, display: "flex", alignItems: "center" }}
          >
            <ErrorOutline sx={{ marginInline: 1 }} />
            خطا در بارگذاری صفحه
          </Typography>
          <Button variant="contained" endIcon={<HomeOutlined />} color="error" onClick={() => navigate("/dashboard")}>
            صفحه اصلی
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ErrorFetchPage;
