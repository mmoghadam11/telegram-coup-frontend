import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "hooks/useAuth";

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
  const userRole = Auth?.userInfo?.role ?? "player";

  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PermissionRoute;