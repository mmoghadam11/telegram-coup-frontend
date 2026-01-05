import { ActionTypes } from "redux/actionTypes";

export interface SetAccessToken {
  type: ActionTypes.SET_ACCESS_TOKEN;
  payload: string;
}

export interface UserInfo {
  id: number;
  userName: string;
  password: string;
  degree?: string;
  firstName: string;
  lastName: string;
  mobile?: string;
  nationalCode?: number;
  pesonnelId?: number;
  avatar?: string;
  changedPwCount?: number;
  retryCount?: number;
  email?: string;
  roles: Array<{
    id: number;
    name: string;
    title: string;
  }>;
}

export interface UserAccessRole {
  roleName: string;
  permissionKey: Array<string>;
  resourceKey: Array<string>;
  menuKey: Array<string>;
}

export interface UserAccess {
  admin: boolean;
  clientName?: string;
  roleName?: Array<UserAccessRole>;
}

export interface SetUserInfo {
  type: ActionTypes.SET_USER_INFO;
  payload: UserInfo;
}

export interface DeleteUser {
  type: ActionTypes.DELETE_USER;
}

export interface SetUserAccess {
  type: ActionTypes.SET_USER_ACCESS;
  payload: UserAccess;
}

export type UserAction = SetAccessToken | SetUserInfo | DeleteUser | SetUserAccess;
