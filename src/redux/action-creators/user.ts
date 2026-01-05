import {ActionTypes} from "../actionTypes";
import {DeleteUser, SetAccessToken, SetUserAccess, SetUserInfo} from "../actions";

export const ACT_SetAccessToken = (payload: any): SetAccessToken => ({
    type: ActionTypes.SET_ACCESS_TOKEN,
    payload,
});

export const ACT_SetUserInfo = (payload: any): SetUserInfo => ({
    type: ActionTypes.SET_USER_INFO,
    payload,
});

export const ACT_DeleteUser = (): DeleteUser => ({
    type: ActionTypes.DELETE_USER,
});

export const ACT_SetUserAccess = (payload: any): SetUserAccess => ({
    type: ActionTypes.SET_USER_ACCESS,
    payload,
});
