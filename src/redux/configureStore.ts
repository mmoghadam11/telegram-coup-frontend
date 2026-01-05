import {configureStore} from "@reduxjs/toolkit";
import reducer from "../redux/reducers/rootReducer";
/*
declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const persistConfig = {
    key: "hr_cartable",
    storage,
};
const persistedReducer = persistReducer(persistConfig, reducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    persistedReducer,
    {},
    composeEnhancers(applyMiddleware(thunk)),
);*/

// const persistor = persistStore(store);

const store = configureStore({
    reducer
})

export {store};
