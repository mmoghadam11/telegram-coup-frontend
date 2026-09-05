import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { Box, CircularProgress } from "@mui/material";

type PermissionRouteProps = {
  allowedRoles: string[];
  redirectPath?: string;
  children?: React.ReactNode;
};

const PermissionRoute: React.FC<PermissionRouteProps> = ({
  allowedRoles,
  redirectPath = "/404",
  children,
}) => {
  const Auth = useAuth();
  // تا وقتی فرآیند لاگین (initData -> verify) تموم نشده، صبر کن
  if (Auth?.authLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  // اگه لاگین ناموفق بود یا اصلاً کاربری نیست
  if (!Auth?.isUserLoggedIn || !Auth?.userInfo) {
    return <Navigate to={redirectPath} replace />;
  }
  const userRole = Auth?.userInfo?.role ?? "player";
  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PermissionRoute;