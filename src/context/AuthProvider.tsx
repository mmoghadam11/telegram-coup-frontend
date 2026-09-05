import React, { useEffect, useState } from "react";
import axios from "axios";
import { api, apiUpload, BASE_URL } from "services/axios";
import useSessionStorage from "hooks/useSessionStorage";
import useLocalStorage from "hooks/useLocalStorge";
import { useSnackbar } from "hooks/useSnackbar";
import { convertArabicCharToPersian } from "services/convertArabicCharToPersian";
import { TAuthContext, TServerCall } from "types/authContext";

interface TelegramUser {
  id: number;
  telegram_id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  photo_url?: string;
  role:string
}

interface Props {
  children: React.ReactNode;
}

let localToken = "";

export const AuthContext = React.createContext<TAuthContext | null>(null)

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
      snackbar("این برنامه باید از داخل تلگرام باز بشه.","error")
      setAuthLoading(false);
      return;
    }

    axios
      .post(`${BASE_URL}/auth/telegram`, { initData: tg.initData })
      .then((res) => {
        storeToken(res.data.sessionToken);
        setUserInfo(res.data.user);
        snackbar("شما"+res.data.user.first_name+"هستید","info")
      })
      .catch((err) => {
        console.error("telegram auth failed", err);
        alert(err)
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
  const serverCallUpload = async ({ entity, method, data }: TServerCall) => {
    try {
      let requestOptions = {
        url: convertArabicCharToPersian(entity),
        method,
        headers: {
          Authorization: "Bearer " + (localToken || token),
        },
        redirect: "follow",
        ...(data && { data: data }),
      };
      let response = await apiUpload({ ...requestOptions });
      if (response.status === 200) {
        return response.data;
      } else if (response.status === 204) {
        return { data: { rows: [] } };
      } else {
        // setNotification(response.status, `خطا در انجام عملیات - ${response?.statusText}`, "error");
        // setNotification(response.status, "", "error");
        throw new Error(`خطا در انجام عملیات - ${response?.statusText}`);
      }
    } catch (e: any) {
      if (e?.response?.status === 401) {
        clearUserInfo();
      }
      throw e.response || new Error(`خطا در انجام عملیات`);
    }
  };
  const serverCallGetFile = async ({
    entity,
    method = "get",
    data,
  }: TServerCall) => {
    try {
      let requestOptions = {
        url: convertArabicCharToPersian(entity),
        method,
        headers: {
          Authorization: "Bearer " + (localToken || token),
        },
        responseType: "blob",
        redirect: "follow",
        ...(data && { data: data }),
      };
      let response = await apiUpload({ ...requestOptions });
      if (response.status === 200) {
        return response.data;
      } else if (response.status === 204) {
        return { data: { rows: [] } };
      } else {
        // setNotification(response.status, `خطا در انجام عملیات - ${response?.statusText}`, "error");
        // setNotification(response.status, "", "error");
        throw new Error(`خطا در انجام عملیات - ${response?.statusText}`);
      }
    } catch (e: any) {
      if (e?.response?.status === 401) {
        clearUserInfo();
      }
      throw e.response || new Error(`خطا در انجام عملیات`);
    }
  };
const getRequestDownloadFile = async ({
    queryKey,
  }: {
    queryKey: string | number | boolean | Array<number | boolean | string>;
  }) => {
    let tempEntity = queryKey;
    if (Array.isArray(queryKey)) {
      tempEntity = queryKey.join("/");
    }
    tempEntity = String(tempEntity);
    try {
      return await serverCallGetFile({ entity: tempEntity, method: "get" });
    } catch (error: any) {
      throw new Error(error?.message || `خطا در انجام عملیات`);
    }
  };

  // const getRequest = async ({
  //   queryKey,
  // }: {
  //   queryKey: string | number | boolean | Array<number | boolean | string>;
  // }) => {
  //   let tempEntity = queryKey;
  //   if (Array.isArray(queryKey)) {
  //     tempEntity = queryKey.join("/");
  //   }
  //   tempEntity = String(tempEntity);
  //   try {
  //     return await serverCall({ entity: tempEntity, method: "get" });
  //   } catch (error: any) {
  //     throw new Error(error?.message || `خطا در انجام عملیات`);
  //   }
  // };
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
        serverCallUpload,
        serverCallGetFile,
        getRequestDownloadFile,
        getRequest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;