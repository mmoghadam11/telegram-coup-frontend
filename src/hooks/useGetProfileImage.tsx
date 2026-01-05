// hooks/useDebounce.ts
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export function UseGetProfileImage<T>(userName: T) {
  const Auth = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>("");
  const {
    data: image,
    status: image_status,
    refetch: image_refetch,
  } = useQuery<any>({
    queryKey: [`user/download-profile-image?username=${userName}`],
    queryFn: Auth?.getRequestDownloadFile,
    select: (res: any) => {
      return res;
    },
    enabled: true,
  } as any);
  useEffect(() => {
    let objectUrl: string | null = null;

    // 1. چک کنید که داده‌ی تصویر وجود دارد و از نوع Blob است
    if (image && image instanceof Blob && image.type.startsWith("image/")) {
      // 2. یک URL موقت از Blob بسازید
      objectUrl = URL.createObjectURL(image);
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
  return { image, image_status, image_refetch, avatarUrl, setAvatarUrl };
}
