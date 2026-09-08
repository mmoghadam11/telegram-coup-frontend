import React, { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import LogoutPage from "./domains/logout/pages/Logout";
import NotFound from "components/errorPages/notFound/NotFound";
import Welcome from "domains/welcome/Welcome";
import renderRoutes, { MenuItem } from "components/routeHelper/renderRoutes";
import Envelope from "domains/envelope/Envelope";
import MEnvelope from "domains/envelope/motion/MEnvelope";
import Lobby from "domains/lobby/Lobby";
import Room from "domains/rooms/Room";
import Layout from "components/layout/Layout";


const AppRoutes: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  // بلافاصله بعد از لاگین، اگه کاربر یه روم فعال داره، ببرش همونجا
  useEffect(() => {
    if (auth?.authLoading) return; // صبر کن لاگین تموم بشه

    const activeRoomId = auth?.userInfo?.active_room_id;
    if (!activeRoomId) return; // روم فعالی نداره، کاری نکن

    // اگه از قبل توی همون روم نیست، ببرش اونجا
    if (!routerLocation.pathname.startsWith(`/room/${activeRoomId}`)) {
      navigate(`/room/${activeRoomId}`, { replace: true });
    }
  }, [auth?.authLoading, auth?.userInfo?.active_room_id, navigate, routerLocation.pathname]);
  const MENU_ITEMS: MenuItem[] = [
  {
    url: "lobby",
    access: ["player", "admin"],
    component: <Lobby />,
  },
  {
    url: "room/:roomId",
    access: ["player", "admin"],
    component: <Room />,
  },
];
  return (
    <Routes>
      {/* <Route element={<UserRoute />}> */}
      {renderRoutes(MENU_ITEMS)}        
      <Route path="/" element={<Welcome />} />
      {/* </Route> */}
      <Route path="/post" element={<Envelope/>} />
      <Route path="/motion" element={<MEnvelope/>} />
      <Route path="logout" element={<LogoutPage />} />
      <Route path="404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
type ProtectedRouteProps = {
  redirectPath?: string;
  children?: React.ReactNode;
};
const UserRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <Layout>{children ?? <Outlet />}</Layout>;
};
export default AppRoutes;