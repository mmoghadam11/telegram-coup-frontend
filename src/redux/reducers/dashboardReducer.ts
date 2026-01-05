import { ActionTypes } from "../actionTypes";
import { DashboardAction } from "../actions";

interface dashboardState {
  darkTheme: Boolean;
}

const initialState = {
  darkTheme: false,
};

export const dashboardReducer = (
  state: dashboardState = initialState,
  action: DashboardAction,
) => {
  switch (action.type) {
    case ActionTypes.SET_THEME:
      return {
        ...state,
        darkTheme: action.payload,
      };

    default:
      return state;
  }
};
