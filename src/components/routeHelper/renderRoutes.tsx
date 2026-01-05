import React from "react";
import { Route } from "react-router-dom";
import PermissionRoute from "./PermissionRoute";
// ایمپورت کامپوننت PermissionRoute و سایر کامپوننت‌ها...

export interface MenuItem {
  title?: string;
  url: string;
  access?: string[];
  icon?: React.ReactNode;
  menuChildren?: MenuItem[];
  component?: React.ReactNode; // <--- این را اضافه کنید
};
// تابع بازگشتی برای ساخت روت‌ها
const renderRoutes = (items: MenuItem[]) => {
  return items.map((item, index) => {
    // حذف اسلش اول برای جلوگیری از مشکلات مسیردهی نسبی (Optional)
    const path = item.url.startsWith("/") ? item.url.substring(1) : item.url;

    return (
      <Route
        key={`${item.url}-${index}`}
        path={path}
        // اینجا PermissionRoute نقش گارد امنیتی را بازی می‌کند
        element={item?.access?<PermissionRoute allowedRoles={item.access}/>:null}
      >
        {/* حالت ۱: اگر این آیتم خودش یک صفحه نهایی است (کامپوننت دارد) 
           آن را به عنوان index رندر می‌کنیم.
           این کار باعث می‌شود اگر مسیر /IACPA/workgroup زده شد، 
           اول پرمیشن چک شود، بعد گرید نمایش داده شود.
        */}
        {item.component && <Route index element={item.component} />}

        {/* حالت ۲: اگر فرزند دارد، تابع را دوباره صدا می‌زنیم (Recursion)
         */}
        {item.menuChildren && renderRoutes(item.menuChildren)}
      </Route>
    );
  });
};
export default renderRoutes;
