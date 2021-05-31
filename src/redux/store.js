import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";

// const preloadedState= {a:[],b:[]}

// f34: https://redux-toolkit.js.org/api/configureStore
const store = configureStore({
     reducer,
     /*middleware: (getDefaultMiddleware) => {
          console.log(getDefaultMiddleware());
          return [...getDefaultMiddleware(), anotherMiddleware];
     },*/
     //  halate defaultesh true hast vali age nakhaim faal bashe false mikonim
     devTools: process.env.NODE_ENV !== "production",
     /*  preloadedState,*/
     /*  enhancers: (defaultEnhancers) => [anyEnhancer, ...defaultEnhancers],*/
});

export default store;

/* ***** PREVIOUS SESSIONS ***** */
// import { createStore, applyMiddleware } from "redux";
// import { composeWithDevTools } from "redux-devtools-extension";
// import thunk from "redux-thunk";

// f20: redux dev tools
/*const composedEnhancer = composeWithDevTools(applyMiddleware(thunk));
const store = createStore(rootReducer, composedEnhancer);*/

// f29: thunk
/*const asyncFunctionMiddleware = storeApi => next => action => {
    if (typeof action === 'function') {
        return action(storeApi.dispatch, storeApi.getState)
    }
    return next(action)
}*/
