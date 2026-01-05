import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { ChangeCircle, Logout, ManageAccounts, ManageAccountsRounded, Password } from "@mui/icons-material";
import { DRAWER_WIDTH } from "./Layout";
import { useAuth } from "hooks/useAuth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { ColorModeContext } from "App";
import Popover from "@mui/material/Popover";
import Switch from "@mui/material/Switch";
import "./Navbar.css";
import { isMobile } from "react-device-detect";
import { store } from "../../redux/configureStore";
import { mainProviderContext } from "context/MainProviderContext";
import UploadAvatarSimpleDialog from "./UploadAvatarSimpleDialog";
import { useQuery } from "@tanstack/react-query";
import paramsSerializer from "services/paramsSerializer";
import UserProfile from "./UserProfile";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

type Props = {
  open: boolean;
  hideRightMenu: boolean;
  handleDrawerOpen: () => void;
};

const Navbar: React.FC<Props> = ({ open, hideRightMenu, handleDrawerOpen }) => {
  const Auth = useAuth();
  const navigate = useNavigate();

  const { access } = useContext(mainProviderContext);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [openProfile, setOpenProfile] = useState(false);
  const [openAvatar, setOpenAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isOpenUserMenu = Boolean(anchorEl);

  const colorMode = React.useContext(ColorModeContext);
  const filters={
    username :localStorage.getItem("username")
  }
  const {
      data: image,
      status: image_status,
      refetch: image_refetch,
    } = useQuery<any>({
      queryKey: [`user/download-profile-image${paramsSerializer(filters)}`],
      queryFn: Auth?.getRequestDownloadFile,
      select: (res: any) => {
        return res;
      },
      enabled: true,
    } as any);
    useEffect(() => {
    let objectUrl: string | null = null;

    // 1. چک کنید که داده‌ی تصویر وجود دارد و از نوع Blob است
    if (image && image instanceof Blob&&image.type.startsWith("image/")) {
      // 2. یک URL موقت از Blob بسازید
      objectUrl = URL.createObjectURL(image);
      // 3. URL ساخته شده را در استیت قرار دهید
      setAvatarUrl(objectUrl);
    }
    if (image && image instanceof Blob&&!image.type.startsWith("image/")) {
      // 2. یک URL موقت از Blob بسازید
      objectUrl = "";
      // 3. URL ساخته شده را در استیت قرار دهید
      setAvatarUrl(objectUrl);
    }

    // 4. (مهم) تابع پاک‌سازی:
    // این تابع زمانی اجرا می‌شود که کامپوننت unmount شود یا 'image' تغییر کند
    return () => {
      if (objectUrl) {
        // URL موقت قبلی را از حافظه مرورگر پاک می‌کند
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [image]);
  return (
    <>
      <Popover
        open={isOpenUserMenu}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          className="account-menu"
        >
          {/* {
            Auth?.userInfo?.member_id ?
            (<Button
              className="account-menu-btn"
              endIcon={<AccountCircleIcon />}
              onClick={() => navigate("/profile")}
              variant="contained"
              color="info"
              sx={{ color: (theme) => theme.palette.text.primary }}
              fullWidth
            >
              پروفایل
            </Button>) : null
          } */}
          <Box
            className="account-menu-btn"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="button">روشنایی</Typography>
            <MaterialUISwitch
              sx={{ m: 1 }}
              onChange={() => colorMode.toggleColorMode()}
              checked={colorMode.mode === "dark"}
            />
          </Box>

          <Button
            className="account-menu-btn"
            sx={{ mt: 1, color: (theme) => theme.palette.text.primary }}
            color="info"
            variant="contained"
            endIcon={<AccountCircleIcon fontSize="large" />}
            onClick={() => setOpenAvatar(true)}
          >
            تصویر پروفایل
          </Button>
          <Button
            className="account-menu-btn"
            sx={{ mt: 1, color: (theme) => theme.palette.text.primary }}
            color="primary"
            variant="contained"
            // endIcon={<ManageAccountsRounded fontSize="large" />}
            endIcon={<Password fontSize="large" />}
            onClick={() => setOpenProfile(true)}
          >
            رمز عبور
          </Button>
          <Button
            className="account-menu-btn"
            sx={{ mt: 1, color: (theme) => theme.palette.text.primary }}
            color="primary"
            variant="contained"
            endIcon={<Logout />}
            onClick={Auth?.logout}
          >
            خروج از سیستم
          </Button>
        </Box>
      </Popover>
      <AppBar
        position="fixed"
        open={open}
        sx={
          {
            // background:
            //   "linear-gradient(90deg, rgba(2,62,138,0.8856136204481793) 6%, rgba(35,159,255,0.7343531162464986) 84%)",
            // backgroundImage: "url(/assets/images/pattern.png)",
            // backgroundSize: "780px",
            // background: rgb(0,145,153);
            // background: (theme) =>
            //   `linear-gradient(20deg, ${theme.palette.primary.main} 70%, ${theme.palette.secondary.main} 100%)`,
            // boxShadow: (theme) => `1px 1px 16px 0px ${theme.palette.secondary.main}`,
          }
        }
      >
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {hideRightMenu ? null : (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box
              component="img"
              sx={{ height: "48px", width: "auto" }}
              src={`${process.env.PUBLIC_URL}/apple-touch-icon.png`}
            />
          </Box>
          {/* <Box sx={{ flexGrow: 1 }}></Box>
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>{pathname}</Box> */}
          <Box sx={{ flexGrow: 1, marginLeft: "20px" }}>
            <Typography variant="h6">
              {isMobile ? "ساحر" : "سامانه ساحــر"}
            </Typography>
          </Box>
          <Box
            sx={{
              flexGrow: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Grid
              container
              spacing={1}
              width={"100%"}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              {/* <Grid item>
                <Box>
                  <Button variant="contained" color="warning" onClick={()=> navigate("/help")}>
                    <Typography variant="caption">
                      {isMobile ? "راهنما" : "راهنمای سامانه"}
                    </Typography>
                  </Button>
                </Box>
              </Grid> */}
              {
                // Auth?.isContractSet() ?
                //   (<Grid item sx={{
                //     display: "flex",
                //     justifyContent: "flex-start",
                //     alignItems: "center",
                //     flexDirection: "row",
                //   }}>
                //     <Typography variant="caption" margin={"5px"}>
                //       {
                //           "کد واحد: "
                //       }
                //     </Typography>
                //     <Typography variant="body1" fontWeight={600}>
                //       {Auth?.userInfo.contract_number}
                //     </Typography>
                //   </Grid>) :
                //   access.admin ?
                //   (<Grid item sx={{
                //     display: "flex",
                //     justifyContent: "flex-start",
                //     alignItems: "center",
                //     flexDirection: "row",
                //   }}>
                //     <Typography variant="caption" margin={"5px"}>
                //       {
                //         "سطح دسترسی: ادمین"
                //       }
                //     </Typography>
                //   </Grid>) : null
              }
            </Grid>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            {isMobile ? null : (
              <>
                <Typography variant="caption" color="inherit" fontWeight={600}>
                  {Auth?.userInfo?.firstName +
                    " " +
                    Auth?.userInfo?.lastName +
                    " " +
                    "عزیز"}
                </Typography>
                <Typography variant="caption" margin={"5px"}>
                  خوش آمدید!
                </Typography>
              </>
            )}
            <IconButton color="inherit" onClick={handleClick}>
              <Avatar
                src={avatarUrl ?? undefined}
                sx={{
                  width: 40,
                  height: 40,
                  border: "2px solid",
                  borderColor: "divider",
                }}
              >
                <AccountCircleIcon sx={{width: 40,height: 40,}} color="inherit" />
              </Avatar>
              {/* <AccountCircleIcon sx={{ fontSize: "28px" }} color="inherit" /> */}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <UploadAvatarSimpleDialog
        refetch={image_refetch}
        open={openAvatar}
        onClose={() => setOpenAvatar(false)}
        currentAvatarUrl={avatarUrl}
        onUploaded={(data) => {
          // بسته به پاسخ سرور آدرس نهایی را ست کنید
          setAvatarUrl(data?.url ?? data?.avatarUrl);
        }}
      />
      <UserProfile
        open={openProfile}
        onClose={() => setOpenProfile(false)}
      />
    </>
  );
};

export default Navbar;

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  margin: "0 -15px 0 0 !important",
  transform: "scale(.75)",
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#ccc"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#000" : "#fff",
    border: `1px solid ${theme.palette.mode === "dark" ? "#000" : "#757575"}`,
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#757575"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));
