export const ACT_updateSystemSettings = settings => (dispatch, getState, API) =>
  API.systemSettings.updateSystemSettings(settings);

export const ACT_getSystemSetting = () => (dispatch, getState, API) =>
  API.systemSettings.getSystemSettings();

export const ACT_getCommonPasswords = record => (dispatch, getState, API) =>
  API.systemSettings.getCommonPasswords(record);

export const ACT_setCommonPassword = record => (dispatch, getState, API) =>
  API.systemSettings.setCommonPassword(record);

export const ACT_deleteCommonPassword = record => (dispatch, getState, API) =>
  API.systemSettings.deleteCommonPassword(record);

export const ACT_updateCommonPassword = record => (dispatch, getState, API) =>
  API.systemSettings.updateCommonPassword(record);
