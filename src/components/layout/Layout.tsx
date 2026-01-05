import * as React from "react";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import RightMenu from "./RightMenu";
import { styled } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

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

const Layout: React.FC<Props> = ({ hideRightMenu=false, children }) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(()=>{
    if(hideRightMenu)
      setOpen(false)
  }, [hideRightMenu])

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {
        hideRightMenu ? null :
        <RightMenu open={open} handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen}/>
      }
      <Box component="div" sx={{ width: "100%", flexDirection: "column", overflowX: "hidden", height: "100vh" }}>
        <Navbar open={open} hideRightMenu={hideRightMenu} handleDrawerOpen={handleDrawerOpen} />
        <Box
          component="main"
          sx={{ display: "flex", flexDirection: "column", flexGrow: 1, width: "100%", height: "100vh" }}
        >
          <DrawerHeader />
          <Box sx={{ p: 2, width: "100%", height: "100%" }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
