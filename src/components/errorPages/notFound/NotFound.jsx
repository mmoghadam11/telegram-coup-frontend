import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box
      component="div"
      sx={{
        position: "relative",
        height: "100vh",
      }}
    >
      <Box
        component="div"
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          webkitTransform: "translate(-50%,-50%)",
          msTransform: "translate(-50%,-50%)",
          transform: "translate(-50%,-50%)",
          axWidth: "710px",
          width: "100%",
          paddingLeft: "190px",
          lineHeight: "1.4",
          maxWidth: "710px",
        }}
      >
        <Box
          component="div"
          sx={{
            position: "absolute",
            left: "0",
            top: "0",
            width: "150px",
            height: "150px",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              display: "block",
              fontSize: "8em",
              marginBlockStart: "0.67em",
              marginBlockEnd: "0.67em",
              marginInlineStart: "0px",
              marginInlineEnd: "0px",
              fontWeight: "bolnslate(-50%,-50%)",
              color: "#009199",
            }}
          >
            :(
          </Typography>
        </Box>
        <Typography
          variant="h2"
          sx={{
            display: "block",
            fontSize: " 1.5em",
            marginBlockStart: " 0.83em",
            marginBlockEnd: " 0.83em",
            marginInlineStart: " 0px",
            marginInlineEnd: "0px",
            fontWeight: "bold",
          }}
        >
          404 - صفحه ای یافت نشد{" "}
        </Typography>
        <Typography
          variant="p"
          sx={{
            display: "block",
            marginBlockStart: "1em",
            marginBlockEnd: "1em",
            marginInlineStart: "0px",
            marginInlineEnd: "0px",
          }}
        >
          صفحه از دسترس خارج می باشد .
        </Typography>
        <Button
          component="button"
          onClick={() => navigate("/")}
          sx={{
            ontFamily: "raleway sans-serif",
            fontSize: "14px",
            textDecoration: "none",
            textTransform: "uppercase",
            background: " #fff",
            display: "inline-block",
            padding: "15px 30px",
            borderRadius: "40px",
            color: "#292929",
            fontWeight: "700",
            webkitBoxShadow: "0 4px 15px -5px rgba(0,0,0,.3)",
            boxShadow: " 0 4px 15px -5px rgba(0,0,0,.3)",
            webkitTransition: ".2s all",
            transition: ".2s all",
          }}
        >
          صفحه اصلی
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;
