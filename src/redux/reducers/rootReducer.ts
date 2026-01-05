import { combineReducers } from "redux";

import { userReducer, dashboardReducer } from "./index";

const reducer = combineReducers({
  user: userReducer,
  dashboard: dashboardReducer,
});

export default reducer;
