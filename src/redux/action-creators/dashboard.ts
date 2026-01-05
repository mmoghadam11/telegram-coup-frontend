import {ActionTypes} from "../actionTypes";
import {SetTheme} from "../actions";

export const ACT_setTheme = (themeValue: any): SetTheme => ({
    type: ActionTypes.SET_THEME,
    payload: themeValue,
});
