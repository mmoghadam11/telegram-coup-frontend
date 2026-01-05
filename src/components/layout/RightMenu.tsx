import React, { useState, useContext } from "react";
import { useLocation, NavLink, Link } from "react-router-dom";
import {
  CSSObject,
  styled,
  Theme,
  alpha,
  useTheme,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  Collapse,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore,
  ManageAccounts,
  Help,
  Password,
  WavingHand,
  BusinessCenter,
  AutoStories,
  Article,
  Bungalow,
  AccountBalance,
  People,
  Gavel,
} from "@mui/icons-material";
import { mainProviderContext } from "context/MainProviderContext";
import { DRAWER_WIDTH, DrawerHeader } from "./Layout";
import { useAuthorization } from "hooks/useAutorization";

// Types
interface MenuItem {
  title: string;
  icon: React.ReactElement;
  url: string;
  access?: string[];
  menuChildren?: ChildMenuItem[];
}
interface ChildMenuItem {
  title: string;
  // icon: React.ReactElement;
  url: string;
  access?: string[];
  menuChildren?: ChildMenuItem[];
}

interface RenderMenuProps extends MenuItem {
  open: boolean;
}

interface RenderMenuWithChildProps extends RenderMenuProps {
  handleDrawerOpen: () => void;
}

// Styled Components
const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  background: `linear-gradient(180deg, ${
    theme.palette.background.default
  } 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
  boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(9)} + 1px)`,
  background: `linear-gradient(180deg, ${
    theme.palette.background.default
  } 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
  boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
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

// Menu Data
const MENU_ITEMS: MenuItem[] = [
  {
    icon: <Gavel />,
    title: "احکام انتظامی(new)",
    url: "IACPA-disciplinary-order",
    access: ["administrator", "city-showmenu","operator-showmenu"],
    menuChildren: [
      {
        title: "پرونده‌های بدوی انتظامی",
        url: "cases",
        access: ["administrator", "city-showmenu","operator-showmenu"],
      },
      {
        title: "احکام عالی انتظامی",
        url: "final",
        access: ["administrator", "city-showmenu","operator-showmenu"],
      },
    ],
  },
  {
    icon: <AccountBalance />,
    title: "جامعه",
    url: "/IACPA",
    access: ["city-showmenu", "operator-showmenu"],
    menuChildren: [
      {
        title: "احکام انتظامی",
        url: "disciplinary-order",
        access: ["administrator", "city-showmenu", "operator-showmenu"],
      },
      {
        title: "کارگروه",
        url: "workgroup",
        access: ["administrator", "city-showmenu"],
      },
      {
        title: "پروانه",
        url: "license",
        access: ["administrator", "city-showmenu"],
      },
      {
        title: "شاغلین سازمان حسابرسی",
        url: "ca_organization",
        access: ["administrator", "city-showmenu"],
      },
    ],
  },

  {
    icon: <BusinessCenter />,
    title: "موسسات",
    url: "/institutions",
    access: ["city-showmenu", "allFirms_showmenu", "allFirmsBasic_showmenu"],
    menuChildren: [
      {
        title: "اطلاعات موسسات",
        url: "information",
        access: [
          "allFirms_showmenu",
          "city-showmenu",
          "allFirmsBasic_showmenu",
        ],
      },
      {
        title: "شرکای موسسه",
        url: "partners",
        access: ["administrator", "city-showmenu", "allFirms_showmenu"],
      },
      {
        title: "حسابداران شاغل در موسسه",
        // url: "personnels",
        url: "hired-accountants",
        access: [
          "administrator",
          "city-showmenu",
          "township-showmenu",
          "allFirms_showmenu",
        ],
      },
      {
        title: "کارکنان حرفه‌ای موسسات",
        url: "persons",
        access: ["administrator", "city-showmenu", "allFirms_showmenu"],
      },
      {
        title: "آموزش مستمر",
        url: "EDU",
        access: ["administrator", "city-showmenu", "allFirms_showmenu"],
      },
      // {
      //   //ثابت و متغیر دارد
      //   title: "حق عضویت موسسه",
      //   url: "membership-fee",
      //   access: ["administrator", "city-showmenu"],
      // },
      // {
      //   title: "قرارداد های حسابرسی",
      //   url: "contracts-concluded",
      //   access: ["administrator", "city-showmenu"],
      // },
      {
        title: "گزارش  های حسابرسی",
        url: "reprts-by-institution",
        access: ["administrator", "city-showmenu"],
      },
      {
        title: "درآمدهای فصلی",
        url: "financial-Statement",
        access: ["administrator", "city-showmenu"],
      },
      {
        title: "آزمون رتبه بندی",
        url: "rating-test",
        access: ["administrator", "city-showmenu"],
      },
      {
        title: "متقاضیان آزمون",
        url: "exam-applicants",
        access: ["administrator", "city-showmenu"],
      },
    ],
  },
  {
    icon: <BusinessCenter />,
    title: "ادمین موسسه",
    url: "/FirmAdmin",
    access: ["township-showmenu"],
    menuChildren: [
      {
        title: "اطلاعات موسسه",
        url: "information",
        access: ["administrator", "city-showmenu", "township-showmenu"],
      },
      {
        title: "شرکای موسسه",
        url: "partners",
        access: ["administrator", "city-showmenu", "township-showmenu"],
      },
      {
        title: "حسابداران شاغل در موسسه",
        // url: "personnels",
        url: "hired-accountants",
        access: ["administrator", "city-showmenu", "township-showmenu"],
      },
      {
        title: "کارکنان حرفه‌ای موسسه",
        url: "persons",
        access: ["administrator", "city-showmenu", "township-showmenu"],
      },
      {
        title: "آموزش مستمر",
        url: "EDU",
        access: ["administrator", "city-showmenu"],
      },
      {
        title: "آزمون رتبه بندی",
        url: "rating-test",
        access: ["administrator", "city-showmenu"],
      },
      // {
      //   title: "دوره های آموزشی",
      //   url: "EDU",
      //   access: ["administrator", "city-showmenu","township-showmenu"],
      // },
      // {
      //   //ثابت و متغیر دارد
      //   title: "حق عضویت موسسه",
      //   url: "membership-fee",
      //   access: ["administrator", "city-showmenu", "township-showmenu"],
      // },
      // {
      //   title: "قرارداد های حسابرسی",
      //   url: "contracts-concluded-by-institution",
      //   access: ["administrator", "city-showmenu"],
      // },
      {
        title: "گزارش  های حسابرسی",
        url: "reprts-by-institution",
        access: ["administrator", "city-showmenu"],
      },
    ],
  },
  {
    icon: <BusinessCenter />,
    title: "مدیرعامل موسسه",
    url: "/director",
    access: ["director-showmenu"],
    menuChildren: [
      {
        title: "احکام انتظامی",
        url: "disciplinary-order",
        access: ["director-showmenu"],
      },
      {
        title: "احکام انتظامی(new)",
        url: "disciplinary-order-new",
        access: ["administrator", "city-showmenu"],
      },
    ],
  },
  {
    icon: <People />,
    title: "حسابداران رسمی",
    url: "/accountant",
    access: [
      "city-showmenu",
      "allAccountants_showmenu",
      "allAccountantsBasic_showmenu",
    ],
    menuChildren: [
      {
        title: "حسابداران رسمی",
        url: "official-users",
        access: [
          "administrator",
          "city-showmenu",
          "allAccountants_showmenu",
          "allAccountantsBasic_showmenu",
        ],
      },
      {
        title: "حق عضویت",
        url: "membershipFee",
        access: ["administrator", "city-showmenu"],
      },
      {
        title: "کارت عضویت",
        url: "membershipCard",
        access: ["administrator", "city-showmenu"],
      },
      {
        title: "پروانه‌کار شاغل انفرادی",
        url: "individualLicense",
        access: ["administrator", "city-showmenu"],
      },
      {
        title: "آموزش مستمر",
        url: "continuousEducation",
        access: ["administrator", "city-showmenu"],
      },
      {
        title: "احکام انتظامی",
        url: "disciplinary-order",
        access: ["administrator", "city-showmenu", "allAccountants_showmenu"],
      },
    ],
  },
  {
    icon: <People />,
    title: "حسابدار رسمی",
    url: "/accountant-user",
    access: ["city-showmenu", "accountant-showmenu"],
    menuChildren: [
      {
        title: "کارتابل",
        url: "cartable",
        access: [
          "administrator",
          "city-showmenu",
          "township-showmenu",
          "accountant-showmenu",
        ],
      },
      {
        title: "حق عضویت",
        url: "membershipFee",
        access: ["administrator", "city-showmenu", "township-showmenu"],
      },
      // {
      //   title: "قراردادها",
      //   url: "individualLicense",
      //   access: ["administrator","city-showmenu","township-showmenu"],
      // },
      {
        title: "احکام انتظامی",
        url: "disciplinary-order",
        access: [
          "administrator",
          "city-showmenu",
          "township-showmenu",
          "accountant-showmenu",
        ],
      },
      {
        title: "احکام انتظامی(new)",
        url: "disciplinary-order-new",
        access: [
          "administrator",
          "city-showmenu",
          "township-showmenu",
          "accountant-showmenu",
        ],
      },
      // {
      //   title: "سابقه آموزش مستمر",
      //   url: "EDU",
      //   access: ["administrator","city-showmenu","township-showmenu","accountant-showmenu"],
      // },
      {
        title: "آموزش مستمر",
        url: "EDU",
        access: ["administrator", "city-showmenu"],
      },
      {
        title: "گزارشات",
        url: "continuousEducation",
        access: ["administrator", "city-showmenu", "township-showmenu"],
      },
    ],
  },
  {
    icon: <AutoStories />,
    title: "گزارشات",
    url: "/projects",
    access: ["city-showmenu"],
    menuChildren: [
      {
        title: "داشبورد",
        url: "dashboard",
        access: ["administrator", "city-showmenu"],
      },
    ],
  },
  {
    icon: <Article />,
    title: "اطلاعات پایه",
    url: "/basic-data",
    access: ["city-showmenu"],
    menuChildren: [
      {
        title: "احکام انتظامی",
        url: "disciplinary-order",
        access: ["administrator", "city-showmenu"],
      },
      {
        title: "اطلاعات پایه کارکنان",
        url: "persons",
        access: ["administrator", "city-showmenu"],
      },
      {
        title: "شهرستان",
        url: "township",
        access: ["administrator", "city-showmenu"],
      },
      {
        title: "شهر",
        url: "city",
        access: ["administrator", "city-showmenu"],
      },
      {
        title: "اطلاعات مشترک",
        url: "public-data",
        access: ["administrator", "city-showmenu"],
      },
    ],
  },
  {
    icon: <ManageAccounts />,
    title: "مدیریت سیستم",
    url: "/management",
    access: ["city-showmenu"],
    menuChildren: [
      {
        title: "کاربران",
        url: "users",
        access: ["administrator", "city-showmenu"],
      },
      {
        title: "اعضا",
        url: "member",
        access: ["administrator"],
      },
      {
        title: "نقش",
        url: "roles",
        access: ["member", "administrator", "city-showmenu"],
      },
      {
        title: "مجوز",
        url: "permissions",
        access: ["member", "administrator", "city-showmenu"],
      },
    ],
  },
  {
    icon: <Help />,
    title: "راهنمای سامانه",
    url: "help",
    access: ["member", "administrator", "city-showmenu"],
  },
];

// Helper Components
const MenuIcon: React.FC<{ icon: React.ReactElement; isActive?: boolean }> = ({
  icon,
  isActive = false,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mr: 2,
        width: "24px",
        height: "24px",
        color: isActive ? theme.palette.primary.contrastText : "inherit",
        fontSize: "22px",
      }}
    >
      {icon}
    </Box>
  );
};

// Main Components
const RenderMenu: React.FC<RenderMenuProps> = ({ title, icon, url, open }) => {
  const theme = useTheme();
  const location = useLocation();
  const isActive = location.pathname === url;

  return (
    <NavLink to={url} style={{ textDecoration: "none" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1.5,
          m: 1,
          borderRadius: "12px",
          fontSize: "15px",
          color: isActive
            ? theme.palette.primary.contrastText
            : theme.palette.text.secondary,
          background: isActive
            ? `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(
                theme.palette.primary.main,
                0.8
              )} 100%)`
            : "transparent",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            background: isActive
              ? `linear-gradient(90deg, ${
                  theme.palette.primary.main
                } 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`
              : alpha(theme.palette.primary.main, 0.05),
            color: isActive
              ? theme.palette.primary.contrastText
              : theme.palette.primary.main,
            transform: "translateX(4px)",
          },
        }}
      >
        <MenuIcon icon={icon} isActive={isActive} />
        <Typography
          sx={{
            fontWeight: isActive ? 600 : 400,
            opacity: open ? 1 : 0,
            transition: "all 0.3s ease-in-out",
            fontSize: "0.9rem",
          }}
        >
          {title}
        </Typography>
      </Box>
    </NavLink>
  );
};

const RenderMenuWithChild: React.FC<RenderMenuWithChildProps> = ({
  title,
  icon,
  url,
  open,
  handleDrawerOpen,
  menuChildren,
}) => {
  const theme = useTheme();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const isChildActive = menuChildren?.some(
    (child) => location.pathname === `${url}/${child.url}`
  );

  const handleToggle = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!open) {
      handleDrawerOpen();
      setTimeout(() => setExpanded(true), 300);
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <Box sx={{ width: "100%", mb: 0.5 }}>
      <Box
        onClick={handleToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1.5,
          m: 1,
          borderRadius: "12px",
          cursor: "pointer",
          color: isChildActive
            ? theme.palette.primary.main
            : theme.palette.text.secondary,
          background: isChildActive
            ? alpha(
                theme.palette.primary.main,
                theme.palette.mode === "light" ? 0.1 : 0.3
              )
            : "transparent",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            background: alpha(
              theme.palette.primary.main,
              theme.palette.mode === "light" ? 0.05 : 0.2
            ),
            color: theme.palette.primary.main,
          },
        }}
      >
        <MenuIcon icon={icon} />
        <Typography
          sx={{
            flexGrow: 1,
            fontWeight: isChildActive ? 600 : 400,
            opacity: open ? 1 : 0,
            transition: "opacity 0.3s ease",
            fontSize: "0.9rem",
          }}
        >
          {title}
        </Typography>
        {open && (
          <ExpandMore
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
              fontSize: "20px",
            }}
          />
        )}
      </Box>

      <Collapse in={open && expanded} timeout="auto" unmountOnExit>
        {/**
         * @description menu item sizing
         * */}
        <Box sx={{ pl: 4, pr: 1 }}>
          {menuChildren?.map((child) => (
            <NavLink
              key={`${url}/${child.url}`}
              to={`${url}/${child.url}`}
              style={{ textDecoration: "none" }}
            >
              {({ isActive }) => (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    pl: 3,
                    m: 0.5,
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: isActive
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.secondary,
                    background: isActive
                      ? `linear-gradient(90deg, ${alpha(
                          theme.palette.primary.main,
                          0.8
                        )} 0%, ${theme.palette.primary.main} 100%)`
                      : "transparent",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      background: isActive
                        ? `linear-gradient(90deg, ${alpha(
                            theme.palette.primary.main,
                            0.8
                          )} 0%, ${theme.palette.primary.main} 100%)`
                        : alpha(
                            theme.palette.primary.main,
                            theme.palette.mode === "light" ? 0.05 : 0.2
                          ),
                      color: isActive
                        ? theme.palette.primary.contrastText
                        : theme.palette.primary.main,
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {/* <MenuIcon icon={child.icon} isActive={isActive} /> */}
                  <Typography
                    sx={{
                      fontWeight: isActive ? 600 : 400,
                      opacity: open ? 1 : 0,
                      transition: "opacity 0.3s ease",
                      fontSize: "0.85rem",
                    }}
                  >
                    {child.title}
                  </Typography>
                </Box>
              )}
            </NavLink>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

// Main Component
const RightMenu: React.FC<{
  open: boolean;
  handleDrawerClose: () => void;
  handleDrawerOpen: () => void;
}> = ({ open, handleDrawerClose, handleDrawerOpen }) => {
  const { access } = useContext(mainProviderContext);
  const theme = useTheme();
  const authFunctions = useAuthorization();
  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "static",
          padding: "10px 12px",
          minHeight: "64px",
          background: alpha(theme.palette.primary.main, 0.1),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Link to="/dashboard" style={{ textDecoration: "none", flexGrow: 1 }}>
          <Typography
            variant="h6"
            noWrap
            fontWeight={700}
            fontSize={16}
            sx={{
              color: theme.palette.primary.main,
              transition: "opacity 0.3s ease",
              opacity: open ? 1 : 0,
            }}
          >
            جامعه حسابداران رسمی ایران
          </Typography>
        </Link>
        <IconButton
          onClick={handleDrawerClose}
          sx={{
            color: theme.palette.primary.main,
            background: alpha(theme.palette.primary.main, 0.1),
            "&:hover": {
              background: alpha(theme.palette.primary.main, 0.2),
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </DrawerHeader>

      <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />

      <List sx={{ padding: "8px 0", flexGrow: 1 }}>
        {MENU_ITEMS.filter((item) => {
          // return item.access?.includes(access?.accessMenu[0]);
          return authFunctions?.hasMenuAccess(item.access);
        }).map((menu) => {
          if (menu.menuChildren?.length) {
            let minichild = menu.menuChildren.filter((item) =>
              // item.access?.includes(access?.roleName[0])
              authFunctions?.hasMenuAccess(item.access)
            );
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
    </Drawer>
  );
};

export default RightMenu;
