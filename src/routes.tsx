import React, {  } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import LogoutPage from "./domains/logout/pages/Logout";
import NotFound from "components/errorPages/notFound/NotFound";
import Welcome from "domains/welcome/Welcome";
import renderRoutes, { MenuItem } from "components/routeHelper/renderRoutes";
import Envelope from "domains/envelope/Envelope";
import MEnvelope from "domains/envelope/motion/MEnvelope";
import Lobby from "domains/lobby/Lobby";


const AppRoutes: React.FC = () => {
  const auth = useAuth();
  const isUserLoggedIn = auth?.isUserLoggedIn ?? false;
  const MENU_ITEMS: MenuItem[] = [
  {
    url: "lobby",
    access: ["player", "admin"],
    component: <Lobby />,
  },
  {
    url: "room/:roomId",
    access: ["player", "admin"],
    // component: <Room />,
  },
];
  return (
    <Routes>
      {renderRoutes(MENU_ITEMS)}        
      <Route path="/" element={<Welcome />} />
      <Route path="/post" element={<Envelope/>} />
      <Route path="/motion" element={<MEnvelope/>} />
      <Route path="logout" element={<LogoutPage />} />
      <Route path="404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;