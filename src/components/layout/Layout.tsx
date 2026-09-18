import * as React from "react";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import RightMenu from "./RightMenu";
import { styled } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import NavbarOnly from "./NavbarOnly";
import { ColorModeContext } from "App";

export const DRAWER_WIDTH = 280;

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface Props {
  hideRightMenu?: boolean;
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ hideRightMenu = false, children }) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (hideRightMenu)
      setOpen(false)
  }, [hideRightMenu])

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const colorMode = React.useContext(ColorModeContext);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {
        // hideRightMenu ? null :
        // <RightMenu open={open} handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen}/>
      }
      <Box component="div" sx={{
        width: "100%", flexDirection: "column", overflowX: "hidden", height: "100vh",
        // background: "#FCF8EF",

        background: colorMode.mode !== "dark" ? "radial-gradient(circle, rgba(252, 248, 239, 1) 0%, rgba(246, 240, 227, 1) 100%)" : "default"
      }}>
        {/* <Navbar open={open} hideRightMenu={hideRightMenu} handleDrawerOpen={handleDrawerOpen} /> */}
        <NavbarOnly />
        <Box
          component="main"
          sx={{ display: "flex", flexDirection: "column", flexGrow: 1, width: "100%", height: "100vh" }}
        >
          <DrawerHeader />
          <Box sx={{ p: 0, width: "100%", height: "100%" }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
