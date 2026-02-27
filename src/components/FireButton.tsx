import { Box, Button } from "@mui/material";

const FireButton = () => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        padding: "6px",           // فضای شعله
        borderRadius: "14px",

        "&:hover .fire": {
          opacity: 1,
        },

        "& .fire": {
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          opacity: 0,
          filter: "blur(10px)",
          animation: "fireMove 1.2s infinite ease-in-out",
          background:
            "conic-gradient(from 0deg, #fff59d, #ff9800, #f44336, #ff9800, #fff59d)",
          mask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        },

        "@keyframes fireMove": {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(2deg) scale(1.05)" },
          "100%": { transform: "rotate(-2deg) scale(1)" },
        },
      }}
    >
      <Box className="fire" />

      <Button
        sx={{
          position: "relative",
          zIndex: 1,
          borderRadius: "10px",
          px: 4,
          py: 1.5,
          background: "#111",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        شروع بازی
      </Button>
    </Box>
  );
};

export default FireButton;
