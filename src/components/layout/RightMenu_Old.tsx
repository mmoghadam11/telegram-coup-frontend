import React, { useContext } from "react";
import { CSSObject, styled, Theme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { DRAWER_WIDTH, DrawerHeader } from "./Layout";
import { Link, NavLink } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Icon,
  Typography,
} from "@mui/material";
import {
  ChecklistRtl,
  Dashboard,
  Home,
  Map,
  Password,
  Help,
  Description,
  GroupAdd,
  Person,
  AdminPanelSettings,
  Report,
  Checklist,
  House,
  HomeWork,
  HolidayVillage,
  ManageAccounts,
  AutoStories,
  Apartment,
  Bungalow,
  Fingerprint,
  MonetizationOn,
  Groups3,
  HistoryEdu,
} from "@mui/icons-material";

import { SxProps } from "@mui/system";
import { useAuth } from "hooks/useAuth";
import { useAuthorization } from "hooks/useAutorization";
import { mainProviderContext } from "context/MainProviderContext";

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

type Props = {
  open: boolean;
  handleDrawerClose: () => void;
  handleDrawerOpen: () => void;
};

const RightMenu: React.FC<Props> = ({
  open,
  handleDrawerClose,
  handleDrawerOpen,
}) => {
  const Auth = useAuth();
  const { access } = useContext(mainProviderContext);

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "static",
        }}
      >
        <Link
          to={"/dashboard"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <Typography
            variant="body1"
            noWrap
            fontWeight={700}
            fontSize={15}
            sx={{ color: (theme) => theme.palette.primary.main }}
          >
            جامعه حسابداران رسمی ایران 
          </Typography>
        </Link>
        <IconButton onClick={handleDrawerClose}>
          <ChevronRightIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List style={{ paddingTop: "0px" }}>
        {MENU_ITEMS
        // .filter((item) => {
        //   return item.access?.includes(access?.roleName[0]);
        // })
        .map((menu) => {
          if (menu.menuChildren?.length) {
            let minichild = menu.menuChildren
            // .filter((item) =>
            //   item.access?.includes(access?.roleName[0])
            // );
            return (
              <RenderMenuWithChild
                key={menu.url}
                title={menu.title}
                icon={menu.icon}
                url={menu.url}
                menuChildren={minichild}
                open={open}
                handleDrawerOpen={handleDrawerOpen}
              />
            );
          } else {
            return (
              <RenderMenu
                key={menu.url}
                title={menu.title}
                icon={menu.icon}
                url={menu.url}
                open={open}
              />
            );
          }
        })}
      </List>
      {/* {open ? (
        <Box
          height={"100%"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant="body2">سامانه پاسخگویی</Typography>
          <a href="tel:02145714444">
            <Typography variant="body1">021-45714444</Typography>
          </a>
          <Button sx={{ margin: "10px" }}>
            <a
              href="https://web.eitaa.com/#@Betaja_crm"
              target="_blank"
              style={{
                color: "#0C9CE4",
                fontSize: "13px",
                marginTop: "5px",
                textAlign: "center",
              }}
            >
              گفت و گوی آنلاین
            </a>
          </Button>
        </Box>
      ) : null} */}
    </Drawer>
  );
};

export default RightMenu;

type TRenderMenu = {
  title: string | undefined;
  icon?: React.ReactElement;
  url: string;
  menuChildren?: Array<TRenderMenu>;
  access?: Array<string>;
};

type RenderMenuProps = TRenderMenu & { open: boolean };

type RenderMenuWithDrawerOpener = RenderMenuProps & {
  handleDrawerOpen: () => void;
};

type RenderIconProps = {
  icon: React.ReactElement | undefined;
  isActive: boolean;
  iconSX?: SxProps<Theme>;
};

const RenderIcon: React.FC<RenderIconProps> = ({ icon, isActive, iconSX }) => {
  if (icon) return <Icon sx={iconSX ?? { mr: "1rem" }}>{icon}</Icon>;
  return <></>;
};
const RenderMenu: React.FC<RenderMenuProps> = ({ title, icon, url, open }) => {
  return (
    <NavLink
      to={url}
      style={{
        width: "100%",
        textDecoration: "none",
        transition: "all 0.2s linear",
      }}
    >
      {({ isActive, isPending }) => (
        <Box
          sx={{
            fontWeight: isActive ? 700 : 400,
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            background: isActive
              ? (theme) => theme.palette.primary.main
              : "none",
            p: 1.5,
            m: 1,
            fontSize: "18px",
            borderRadius: "10px",
            // color: (theme) => (isActive ? theme.palette.secondary.dark : theme.palette.text.primary),
            color: (theme) => theme.palette.text.primary,
          }}
        >
          <Icon sx={{ mr: 2, color: isActive ? "white" : "inherit" }}>
            {icon}
          </Icon>
          <Typography
            sx={{
              transition: "all .3s ease-in-out",
              fontWeight: isActive ? 700 : 400,
              opacity: open ? 1 : 0,
              color: isActive ? "white" : "inherit",
            }}
          >
            {title}
          </Typography>
        </Box>
      )}
    </NavLink>
  );
};
const RenderMenuWithChild: React.FC<RenderMenuWithDrawerOpener> = ({
  title,
  icon,
  url,
  open,
  handleDrawerOpen,
  menuChildren,
}) => {
  const [openAccordion, setOpenAccordion] = React.useState(false);

  const handleAccordion = () => {
    if (open === false) {
      handleDrawerOpen();
    }
    setOpenAccordion(!openAccordion);
  };

  React.useEffect(() => {
    if (open == false) {
      setOpenAccordion(false);
    }
  }, [open]);

  // TODO: must fix this menu
  let template = <RenderMenu title={title} icon={icon} url={url} open={open} />;
  if (menuChildren?.length) {
    template = (
      <Accordion TransitionProps={{ unmountOnExit: true }}>
        <AccordionSummary
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexFlow: "row",
          }}
        >
          <Box
            sx={{
              width: "100%",
              paddingInlineStart: "0.45rem",
              scrollPaddingInline: "20px",
              fontWeight: 700,
              fontSize: "1.25rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Icon sx={{ mr: 2 }}>{icon}</Icon>
              <span
                style={{
                  fontSize: ".9rem",
                }}
              >
                {title}
              </span>
            </div>
            <IconButton color="primary">
              <ChevronRightIcon
                sx={{
                  display: "inline-block",
                  transform: "rotate(90deg)",
                }}
              />
            </IconButton>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {menuChildren.map((child: TRenderMenu) =>
            child.menuChildren?.length ? (
              <RenderMenuWithChild
                handleDrawerOpen={handleDrawerOpen}
                title={child.title}
                icon={child.icon}
                url={child.url}
                open={open}
                menuChildren={child.menuChildren}
              />
            ) : (
              <NavLink
                key={child.url}
                to={`${child.url}`}
                style={{
                  width: "100%",
                  textDecoration: "none",
                  transition: "all 0.2s linear",
                }}
              >
                {({ isActive, isPending }) => (
                  <Box
                    sx={{
                      fontWeight: isActive ? 700 : 400,
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      background: isActive
                        ? (theme) => theme.palette.primary.main
                        : "none",
                      p: 1,
                      m: 1,
                      ml: 3,
                      fontSize: "18px",
                      textOverflow: "wrap",
                      flexWrap: "wrap",
                      // color: (theme) => (isActive ? theme.palette.secondary.dark : theme.palette.text.primary),
                      color: (theme) => theme.palette.text.primary,
                    }}
                  >
                    <RenderIcon
                      icon={child?.icon}
                      isActive={isActive}
                    ></RenderIcon>
                    <Typography
                      sx={{
                        transition: "all .3s ease-in-out",
                        fontWeight: isActive ? 700 : 400,
                        opacity: open ? 1 : 0,
                        color: isActive ? "white" : "inherit",
                      }}
                    >
                      {child.title}
                    </Typography>
                  </Box>
                )}
              </NavLink>
            )
          )}
        </AccordionDetails>
      </Accordion>
      // </NavLink>
    );
  }
  return template;
};

const MENU_ITEMS: TRenderMenu[] = [
  {
    icon: <ManageAccounts />,
    title: "مدیریت سیستم",
    url: "projectsss",
    access: ["administrator"],
    menuChildren: [
      {
        icon: <Password />,
        title: "مدیریت کاربران",
        url: "password",
        access: ["administrator"],
      },
      {
        icon: <Person />,
        title: "مدیریت اعضا",
        url: "member",
        access: ["administrator"],
      },
    ],
  },
  
  {
    icon: <Help />,
    title: "راهنمای سامانه",
    url: "help",
    access: ["member", "administrator"],
  },
];
