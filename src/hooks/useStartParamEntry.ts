import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";

let handled = false; // یک‌بار در هر باز شدن برنامه؛ وگرنه بعد از خروج از میز دوباره وارد می‌شد

export function useStartParamEntry() {
  const Auth = useAuth();
  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const { mutate } = useMutation({
    mutationFn: Auth?.serverCall,
    onSuccess: (res: any) => {
      Auth?.setUserInfo({ ...Auth.userInfo, active_room_id: res.roomId });
      navigate(`/room/${res.roomId}`);
    },
    onError: (e: any) => snackbar(e?.data?.error || "ورود به بازی گروه ناموفق بود", "error"),
  });

  useEffect(() => {
    if (handled || !Auth?.token || Auth.authLoading) return;
    handled = true;
    const sp: string | undefined = (window as any).Telegram?.WebApp?.initDataUnsafe?.start_param;
    const m = sp?.match(/^g(\d+)$/);
    if (m) mutate({ entity: `groups/${m[1]}/enter`, method: "post" } as any);
  }, [Auth?.token, Auth?.authLoading]); // eslint-disable-line react-hooks/exhaustive-deps
}