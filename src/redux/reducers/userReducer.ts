import { ActionTypes } from "../actionTypes";
import { UserInfo, UserAction, UserAccessRole, UserAccess } from "../actions";

interface UserState {
  accessToken: string | null;
  info: Partial<UserInfo>;
  access: UserAccess | {admin: boolean; clientName: string; roleName: Array<UserAccessRole>;}
}

const initialState = {
  accessToken: "",
  info: {

  },
  access: {
    admin: false,
    clientName: '',
    roleName: []
  }
};

export const userReducer = (
  state: UserState = initialState,
  action: UserAction,
): UserState => {
  switch (action.type) {
    case ActionTypes.SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.payload,
      };
    case ActionTypes.SET_USER_INFO:
      return {
        ...state,
        info: { ...action.payload },
      };
    case ActionTypes.SET_USER_ACCESS:
      return {
        ...state,
        access: { ...action.payload },
      };
    case ActionTypes.DELETE_USER:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
