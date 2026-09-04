import React, { useEffect, useState } from "react";
import axios from "axios";
import { api, BASE_URL } from "services/axios";
import useSessionStorage from "hooks/useSessionStorage";
import useLocalStorage from "hooks/useLocalStorge";
import { useSnackbar } from "hooks/useSnackbar";

interface TelegramUser {
  id: number;
  telegram_id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  photo_url?: string;
}

interface Props {
  children: React.ReactNode;
}

let localToken = "";

export const AuthContext = React.createContext<any>(null);

const AuthProvider: React.FC<Props> = ({ children }) => {
  const snackbar = useSnackbar();
  const [token, setToken] = useSessionStorage("token");
  const [userInfo, setUserInfo] = useLocalStorage<TelegramUser | null>("userInfo", null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  function storeToken(t: string) {
    localToken = t;
    setToken(t);
  }

  function clearUserInfo() {
    setToken(null);
    setUserInfo(null);
    localToken = "";
  }

  function logout() {
    clearUserInfo();
  }

  // --- ورود از طریق initData تلگرام (فقط یک‌بار، در سطح کل اپ) ---
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;

    if (!tg?.initData) {
      setAuthError("این برنامه باید از داخل تلگرام باز بشه.");
      setAuthLoading(false);
      return;
    }

    axios
      .post(`${BASE_URL}/auth/telegram`, { initData: tg.initData })
      .then((res) => {
        storeToken(res.data.sessionToken);
        setUserInfo(res.data.user);
      })
      .catch((err) => {
        console.error("telegram auth failed", err);
        setAuthError("ورود ناموفق بود.");
      })
      .finally(() => setAuthLoading(false));
  }, []);

  // --- درخواست‌های احرازهویت‌شده (با token) ---
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.response?.status === 401) {
        // session نامعتبر/منقضی شده — کاربر رو خارج کن
        clearUserInfo();
      }
      return Promise.reject(error);
    }
  );

  const serverCall = async ({ entity, method, data }: any) => {
    try {
      const response = await api({
        url: entity,
        method,
        headers: { Authorization: "Bearer " + (localToken || token) },
        ...(data && { data }),
      });
      return response.data;
    } catch (e: any) {
      throw e.response || new Error("خطا در انجام عملیات");
    }
  };

  const getRequest = async ({ queryKey }: { queryKey: string | Array<string | number> }) => {
    const entity = Array.isArray(queryKey) ? queryKey.join("/") : String(queryKey);
    return serverCall({ entity, method: "get" });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userInfo,
        isUserLoggedIn: !!token,
        authLoading,
        authError,
        storeToken,
        setUserInfo,
        serverCall,
        getRequest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;