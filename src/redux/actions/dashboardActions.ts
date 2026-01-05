import { ActionTypes } from "redux/actionTypes";

export interface SetTheme {
  type: ActionTypes.SET_THEME;
  payload: boolean;
}

export type DashboardAction = SetTheme;
