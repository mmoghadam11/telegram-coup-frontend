import React, { Component, useContext } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import Layout from "components/layout/Layout";
import LogoutPage from "./domains/logout/pages/Logout";
import Login from "domains/login/pages/Login";
import useSessionStorageState from "hooks/useSessionStorage";
import Password from "domains/password/pages/Password";
import TavanaSpinner from "components/spinner/TavanaSpinner";
import { mainProviderContext } from "context/MainProviderContext";
import Admin from "domains/admin/pages/Admin";
import ContactNumberAuth from "domains/Authentication/ContactNumberAuth";
import NotFound from "components/errorPages/notFound/NotFound";
import { Typography } from "@mui/material";
import Welcome from "domains/welcome/Welcome";
import UsersGrid from "domains/admin/pages/Users/UsersGrid";
import AddUser from "domains/admin/pages/Users/AddUser";
import RolesGrid from "domains/admin/pages/roles/RolesGrid";
import PermissionGrid from "domains/admin/pages/permissions/PermissionGrid";
import PersonGrid from "domains/person/PersonGrid";
import AddPerson from "domains/person/AddPerson";
import NewLogin from "domains/login/pages/NewLogin";
import renderRoutes, { MenuItem } from "components/routeHelper/renderRoutes";
import { url } from "inspector";


const AppRoutes: React.FC = () => {
  const auth = useAuth();
  const isUserLoggedIn = auth?.isUserLoggedIn ?? false;
  const MENU_ITEMS: MenuItem[] = [
    {
      title: "احکام انتظامی(new)",
      url: "/IACPA-disciplinary-order",
      access: ["administrator", "city-showmenu", "operator-showmenu"],
      menuChildren: [
        {
          title: "پرونده‌های انتظامی",
          url: "cases",
          access: ["administrator", "city-showmenu", "operator-showmenu"],
          // component: <AllDOGrid />,
          menuChildren: [
            {
              url: ":id",
              // component: <ShowDisciplinaryOrderPage editable={true} />,
            },
          ],
        },
        {
          title: "احکام عالی انتظامی",
          url: "final",
          access: ["administrator", "city-showmenu", "operator-showmenu"],
          // component: <AllHCases />,
        },
      ],
    },
    {
      title: "جامعه",
      url: "/IACPA",
      access: ["city-showmenu", "operator-showmenu"],
      menuChildren: [
        {
          title: "احکام انتظامی",
          url: "disciplinary-order",
          access: ["administrator", "city-showmenu", "operator-showmenu"],
          menuChildren: [
            {
              url: ":id",
            },
          ],
        },
        
        {
          title: "پروانه",
          url: "license",
          access: ["administrator", "city-showmenu"],
        },
      ],
    },
  ];
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route
            index
            path="contactNumberAuthentication"
            element={<ContactNumberAuth />}
          />
          <Route index path="admin" element={<Admin />} />
          <Route path="password" element={<Password />} />
        </Route>
        <Route element={<UserRoute />}>
          <Route path="management">
            <Route path="users">
              <Route index element={<UsersGrid />} />
              <Route path=":id" element={<AddUser />} />
            </Route>
            <Route path="roles">
              <Route index element={<RolesGrid />} />
            </Route>
            <Route path="permissions">
              <Route index element={<PermissionGrid />} />
            </Route>
          </Route>
          {renderRoutes(MENU_ITEMS)}        
          <Route path="/" element={<Welcome />} />
        </Route>

        <Route path="contract" element={<RemoveContract />} />
      </Route>

      <Route path="welcome" element={<Welcome />} />
      <Route path="logout" element={<LogoutPage />} />
      <Route
        path="login"
        // element={isUserLoggedIn ? <Navigate to="/" /> : <Login />}
        element={isUserLoggedIn ? <Navigate to="/" /> : <NewLogin />}
      />
      <Route path="404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="login" />} />
    </Routes>
  );
};

export default AppRoutes;

type ProtectedRouteProps = {
  redirectPath?: string;
  children?: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = "/login",
  children,
}) => {
  const auth = useAuth();
  const { access } = useContext(mainProviderContext);
  const navigate = useNavigate();
  const [token, setToken] = useSessionStorageState("token");

  // React.useEffect(() => {
  //   if (window.location.pathname === "/" && window.location.search.length > 10) {
  //     const params = new URLSearchParams(window.location.search);
  //     const tokenFromUrl = params.get("token") ?? "";

  //     if (tokenFromUrl) {
  //       auth?.storeToken(tokenFromUrl);
  //       setToken(tokenFromUrl);
  //       navigate("/", { replace: true });
  //     }
  //   }
  // }, [auth, navigate, setToken]);

  if (!auth?.isUserLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  // if (!access?.roleName?.length) {
  //   return <TavanaSpinner show />;
  // }

  return <>{children ?? <Outlet />}</>;
};

const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { access } = useContext(mainProviderContext);

  if (access?.accessMenu?.[0] === "administrator" && access.admin) {
    return <Layout>{children ?? <Outlet />}</Layout>;
  }

  return <Navigate to="/" replace />;
};
const UserRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <Layout>{children ?? <Outlet />}</Layout>;
};

const RemoveContract: React.FC = () => {
  const auth = useAuth();
  const { access } = useContext(mainProviderContext);

  React.useEffect(() => {
    if (auth?.isContractSet()) {
      auth.setContract(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        null,
        null,
        null,
        false,
        false,
        false,
        ""
      );
    }
  }, [auth]);

  return (
    <Layout hideRightMenu={!access.admin}>
      <Typography>خروجی</Typography>
    </Layout>
  );
};
