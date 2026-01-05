import React from "react";
import { Box } from "@mui/material";

export default function TicketDivider() {
  return (
    <Box
      sx={{
        position: "relative",
        height: "20px",
        // my: 4,
      }}
    >
      {/* خط پرفراژ */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          width: "100%",
          borderBottom: "2px dashed #e0e0e0ff",
          transform: "translateY(-50%)",
        }}
      />

      {/* نیم‌دایره‌های بیرون زده در ابتدا */}
      {/* <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "20px",
          height: "20px", // نیم‌دایره کامل
          bgcolor: "white",
          borderRadius: "50%", // نیم‌دایره از بالا
          transform: "translate(-50%, -50%) rotate(180deg)", // چرخاندن نیم‌دایره به سمت بیرون
          border: "1px solid #aaa",
        }}
      /> */}
      {/* نیم‌دایره‌های بیرون زده در انتها */}
      {/* <Box
        sx={{
          position: "absolute",
          top: "50%",
          right: 0,
          width: "20px",
          height: "20px", // نیم‌دایره کامل
          bgcolor: "white",
          borderRadius: "50%", // نیم‌دایره از بالا
          transform: "translate(50%, -50%) rotate(180deg)", // چرخاندن نیم‌دایره به سمت بیرون
          border: "1px solid #aaa",
        }}
      /> */}
    </Box>
  );
}
