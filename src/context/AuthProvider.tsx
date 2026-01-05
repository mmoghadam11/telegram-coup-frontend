import React, { useState } from "react";
import { TAuthContext, TServerCall } from "../types/authContext";
import jwtDecode from "jwt-decode";
import { api, apiUpload, apiV2, BASE_URL } from "services/axios";
import useLocalStorage from "hooks/useLocalStorge";
import { ILoggedInUser } from "types/user";
import { convertArabicCharToPersian } from "services/convertArabicCharToPersian";
import { useSnackbar } from "hooks/useSnackbar";
import axios from "axios";
import useSessionStorage from "../hooks/useSessionStorage";
import { useErrorHandler } from "../hooks/useErrorHandler";

interface Props {
  children: React.ReactNode;
}

let localToken = "";

export const AuthContext = React.createContext<TAuthContext | null>(null);

const AuthProvider: React.FC<Props> = ({ children }) => {
  const snackbar = useSnackbar();
  const [token, setToken] = useSessionStorage("token");
  const [userInfo, setUserInfo] = useLocalStorage<ILoggedInUser>("userInfo", {
    userId: "",
    firstName: "",
    lastName: "",
    nationalCode: "",
    mobileNumber: "",
    // fatherName: "",
    // projectKey: "",
    // previous_price: "",
    // betaja_price: "",
    // h_price: "",
    // confirmChoiceDate: null,
    // member_id: null,
    // contract_number: null,
    // master: false,
    // confirmSelection: false,
    // finalityOrder: false,
    // systemStep: "",
  });
  // const [userAccess, setUserAccess] = useLocalStorage<any>("userAccess", []);

  const [isRefreshingToken, setIsRefreshingToken] = useState(false);
  const { setNotification } = useErrorHandler();

  function storeToken(t: string) {
    let tempDay = getExpireDate(t);
    localToken = t;
    setToken(t, {
      days: tempDay,
    });
  }

  function storeRefreshToken(refresh_token: string) {
    localStorage.setItem("refreshToken", refresh_token);
  }

  function refreshToken() {
    let ref = localStorage.getItem("refreshToken");
    if (!!ref) {
      axios
        .post(
          process.env.REACT_APP_API_URL + `auth/refresh-token`,
          { refreshToken: ref },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((res) => res.data)
        .then((res) => {
          storeToken(res?.token);
          storeRefreshToken(res?.refresh_token);
          // setContract(
          //   "",
          //   "",
          //   "",
          //   "",
          //   "",
          // );
          window.location.pathname = "/";
        })
        .catch(() => {
          logout();
        });
    }
  }

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const {
        config,
        response: { status },
      } = error;
      const originalRequest = config;

      // -------------
      //TODO: stop multiple refresh token request
      const onRefresh = async () => {
        if (!isRefreshingToken) {
          setIsRefreshingToken(true);
          let tempRefreshToken = localStorage.getItem("refreshToken");
          try {
            let requestOptions = {
              url: `${BASE_URL}user/refresh_token`,
              method: "GET",
              headers: {
                Authorization: "Bearer " + tempRefreshToken,
              },
              redirect: "follow",
            };
            let response = await axios({ ...requestOptions });
            if (response.status === 200) {
              return response.data.result;
            } else {
              clearUserInfo();
              throw new Error(`خطا در انجام عملیات - ${response?.statusText}`);
            }
          } catch (e) {
            clearUserInfo();
            throw new Error(JSON.stringify(e) || `خطا در انجام عملیات`);
          } finally {
            setIsRefreshingToken(false);
          }
        }
      };
      // -------------

      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // const newToken = await onRefresh();
          // storeToken(newToken?.token);
          // localToken = newToken.token;
          // localStorage.setItem("refreshToken", newToken.refreshToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          //update token
          return api(originalRequest);
        } catch (e) {}
      }

      return Promise.reject(error);
    }
  );

  //TODO: stop multiple refresh token request
  const onRefresh = async () => {
    if (!isRefreshingToken) {
      setIsRefreshingToken(true);
      let tempRefreshToken = localStorage.getItem("refreshToken");
      try {
        let requestOptions = {
          url: `${BASE_URL}user/refresh_token`,
          method: "GET",
          headers: {
            Authorization: "Bearer " + tempRefreshToken,
          },
          redirect: "follow",
        };
        let response = await axios({ ...requestOptions });
        if (response.status === 200) {
          return response.data.result;
        } else {
          clearUserInfo();
          throw new Error(`خطا در انجام عملیات - ${response?.statusText}`);
        }
      } catch (e) {
        clearUserInfo();
        throw new Error(JSON.stringify(e) || `خطا در انجام عملیات`);
      } finally {
        setIsRefreshingToken(false);
      }
    }
  };
  // -------------

  const serverCall = async ({
    entity,
    method,
    data = { test: 1 },
  }: TServerCall) => {
    try {
      let requestOptions = {
        // url: convertArabicCharToPersian( apiUrl + entity),
        url: convertArabicCharToPersian(entity),
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (localToken || token),
        },
        // redirect: "follow",
        ...(data && { data: convertArabicCharToPersian(JSON.stringify(data)) }),
      };
      let response = await api({ ...requestOptions });
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
        refreshToken();
        // clearUserInfo();
      }
      throw e.response || new Error(`خطا در انجام عملیات`);
    }
  };
  const serverCallV2 = async ({
    entity,
    method,
    data = { test: 1 },
  }: TServerCall) => {
    try {
      let requestOptions = {
        url: convertArabicCharToPersian(entity),
        method,
        headers: {
          Authorization: "Bearer " + (localToken || token),
        },
        redirect: "follow",
        ...(data && { data: convertArabicCharToPersian(JSON.stringify(data)) }),
      };
      let response = await apiV2({ ...requestOptions });
      if (response.status === 200) {
        return response.data;
      } else if (response.status === 204) {
        return {};
      } else {
        throw new Error(`خطا در انجام عملیات - ${response?.statusText}`);
      }
    } catch (e) {
      throw new Error(JSON.stringify(e) || `خطا در انجام عملیات`);
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

  //OLD LOGOUT
  // async function logout() {
  //   try {
  //     serverCall({
  //       entity: process.env.REACT_APP_API_URL + "/api/v1/auth/logout",
  //       method: "post",
  //       data: null
  //     })
  //     clearUserInfo();
  //   } catch (error) {
  //     snackbar("خطا در ثبت خروج، لطفا مجدد تلاش کنید", "error");
  //   }
  // }
  async function logout() {
    try {
      // ارسال درخواست logout اما بدون انتظار برای پاسخ
      serverCall({
        entity: "auth/logout",
        method: "post",
        data: null,
      }).catch((error) => {
        // فقط خطا را لاگ کنید ولی کاربر را خارج کنید
        console.error("Logout API error:", error);
      });

      // بلافاصله کاربر را خارج کنید
      clearUserInfo();
    } catch (error) {
      // در هر صورت کاربر را خارج کنید
      console.error("Error in logout process:", error);
      clearUserInfo();
    }
  }

  function setContract(
    userId: any,
    firstName: any,
    lastName: any,
    nationalCode: any,
    mobileNumber: any
    // fatherName: any,
    // projectKey: any,
    // previous_price: any,
    // betaja_price: any,
    // h_price: any,
    // confirmChoiceDate: any,
    // member_id: any,
    // contract_number: any,
    // master?: boolean,
    // confirmSelection?: boolean,
    // finalityOrder?: boolean,
    // systemStep?: string
  ) {
    setUserInfo({
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      nationalCode: nationalCode,
      mobileNumber: mobileNumber,
      // fatherName: fatherName,
      // projectKey: projectKey,
      // previous_price: previous_price,
      // betaja_price: betaja_price,
      // h_price: h_price,
      // confirmChoiceDate: confirmChoiceDate,
      // contract_number: contract_number,
      // member_id: member_id,
      // master: master ?? false,
      // confirmSelection: confirmSelection ?? false,
      // finalityOrder: finalityOrder ?? false,
      // systemStep: systemStep ?? "",
    });
  }

  // function isContractSet() {
  //   return userInfo?.contract_number && userInfo?.member_id;
  // }

  function clearUserInfo() {
    setToken(null);
    localStorage.removeItem("username");
    localStorage.removeItem("permission");
    localStorage.removeItem("director");
    localStorage.removeItem("accessMenu");
    localStorage.removeItem("refreshToken");
    // پاک کردن تمام sessionStorage
    // sessionStorage.clear();
    setUserInfo({
      userId: "",
      firstName: "",
      lastName: "",
      nationalCode: "",
      mobileNumber: "",
      // fatherName: "",
      // projectKey: "",
      // previous_price: "",
      // betaja_price: "",
      // h_price: "",
      // confirmChoiceDate: null,
      // member_id: null,
      // contract_number: null,
      // master: false,
      // confirmSelection: false,
      // finalityOrder: false,
      // systemStep: "",
    });
    localToken = "";
    window.location.href = `/login`;
  }

  const getRequest = async ({
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
      return await serverCall({ entity: tempEntity, method: "get" });
    } catch (error: any) {
      throw new Error(error?.message || `خطا در انجام عملیات`);
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
  const getRequestV2 = async ({
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
      return await serverCallV2({ entity: tempEntity, method: "get" });
    } catch (error: any) {
      throw new Error(error?.message || `خطا در انجام عملیات`);
    }
  };

  return (
    <AuthContext.Provider
      value={
        {
          token,
          storeToken,
          serverCall,
          getRequest,
          serverCallV2,
          getRequestV2,
          serverCallUpload,
          serverCallGetFile,
          getRequestDownloadFile,
          isUserLoggedIn: !!token,
          logout,
          userInfo,
          setUserInfo,
          setContract,
          // isContractSet,
          storeRefreshToken,
          refreshToken,
        } as any
      }
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

type TDecodedToken = {
  iat: number;
  exp: number;
};

function getExpireDate(token: string) {
  const DAY_IN_MILLISECONDS = 86400000;
  let decoded: TDecodedToken = jwtDecode(token);
  let expire = decoded.exp * 1000; // convert to miliseconds
  let now = new Date().getTime(); // get current time
  let result = (expire - now) / DAY_IN_MILLISECONDS; // get expire time base on milisecond in day
  return result;
}
