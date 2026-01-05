// PermissionRoute.tsx یا پایین فایل AppRoutes.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useContext, useMemo } from "react";
import { mainProviderContext } from "context/MainProviderContext"; // مسیر درست را وارد کنید
import { useAuthorization } from "hooks/useAutorization";

type PermissionRouteProps = {
  allowedRoles: string[];
  redirectPath?: string;
  children?: React.ReactNode; // اختیاری: اگر بخواهید دور یک کامپوننت خاص بپیچید
};

const PermissionRoute: React.FC<PermissionRouteProps> = ({
  allowedRoles,
  redirectPath = "/404",
  children,
}) => {
  const { access } = useContext(mainProviderContext);
  const{hasMenuAccess}= useAuthorization()

  const hasAccess = useMemo(() => {
    // اگر access هنوز لود نشده یا موجود نیست
    // if (!access?.accessMenu || !Array.isArray(access.accessMenu)) return false;

    // ادمین کل معمولا دسترسی دارد (اختیاری)
    // if (access.accessMenu.includes("administrator")) return true;

    // بررسی وجود حداقل یکی از نقش‌ها
    // return allowedRoles.some((role) => access.accessMenu.includes(role));
    return hasMenuAccess(allowedRoles)
  }, [access, allowedRoles]);

  console.log("allowedRoles",allowedRoles)
    console.log("access",access)
  if (!hasAccess) {
    return <Navigate to={redirectPath} replace />;
  }

  // نکته کلیدی اینجاست:
  // اگر children پاس داده شده بود (حالت Wrapper) آن را رندر کن
  // در غیر این صورت (حالت Layout/Parent) کامپوننت Outlet را رندر کن تا بچه‌ها نمایش داده شوند
  return children ? <>{children}</> : <Outlet />;
};

export default PermissionRoute;