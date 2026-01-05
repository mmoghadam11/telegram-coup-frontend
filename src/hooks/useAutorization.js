import { useEffect, useState } from "react";
import { ACT_SetUserAccess } from "../redux/action-creators";
import { useDispatch } from "react-redux";
import { store } from "../redux/configureStore";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import axios from "axios";

export function useAuthorization() {
  const dispatch = useDispatch();
  const [access, setAccess] = useState({
    admin: false,
    clientName: "",
    accessMenu: [],
  });
  const Auth = useAuth();

  // useEffect(() => {
  //     if (access.accessMenu.length === 0 && !!Auth?.token) {

  //         let config = {
  //             headers: {
  //                 'Authorization': 'Bearer ' + Auth?.token
  //             }
  //         }
  //         axios.get(process.env.REACT_APP_API_URL + "/api/access/access-user", config)
  //         .then(async res => {
  //             await setUserAccess(res?.data?.data)
  //             return res?.data
  //         })
  //         .catch((err) => {
  //             if (err?.response?.status == 401){
  //                 Auth?.logout()
  //             }
  //             if (err?.response?.status == 422){
  //                 Auth?.refreshToken()
  //                 // Auth?.logout()
  //             }
  //         })
  //     }
  // }, [access, Auth?.token]);

  const isAuthorized = () => {
    return access && access.clientName?.length > 0;
  };

  function userAccess() {
    return (
      access ?? {
        admin: false,
        // clientName: "",
        // roleName: [],
      }
    );
  }

  function setUserAccess(accessDTO) {
    setAccess(accessDTO);
    return dispatch(ACT_SetUserAccess(accessDTO));
  }

  function userAccessRoles() {
    return (
      (
        access ??
        store?.getState()?.user?.access ?? {
          admin: false,
          // clientName: "",
          // roleName: [],
        }
      )?.accessMenu ?? []
    );
  }

  function isAuthorizedTo(action) {
    let resources = [];

    userAccessRoles().forEach((role) => {
      resources = resources.concat(role.resourceKey);
    });
  }

  /**
   * @description ++++++++++++NEWFUNCTIONS++++++++++++++++
   *
   */
  function getUserInfo ()  {
    try {
      return {
        username: localStorage.getItem("username") || "",
        permission: JSON.parse(localStorage.getItem("permission") || "[]"),
        accessMenu: JSON.parse(localStorage.getItem("accessMenu") || "[]"),
      };
    } catch {
      return {
        username: "",
        permission: [],
        accessMenu: [],
      };
    }
  };

  function hasPermission  (permissionName) {
    try {
      const permissions = JSON.parse(
        localStorage.getItem("permission") || "[]"
      );
      return permissions.includes(permissionName);
    } catch {
      return false;
    }
  };

  function hasMenuAccess (menuNames)  {
    // try {
    //   const accessMenu = JSON.parse(localStorage.getItem("accessMenu") || "[]");
    //   return accessMenu.includes(menuName);
    // } catch {
    //   return false;
    // }
    try {
    const accessMenu = JSON.parse(localStorage.getItem("accessMenu") || "[]");
    return menuNames.some(menuName => accessMenu.includes(menuName));
  } catch {
    return false;
  }
  };

  return {
    isAuthorized,
    userAccess,
    userAccessRoles,
    isAuthorizedTo,
    setUserAccess,
    getUserInfo,
    hasPermission,
    hasMenuAccess,
  };
}
