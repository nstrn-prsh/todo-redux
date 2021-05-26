import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

// f20: redux dev tools
const composedEnhancer = composeWithDevTools(applyMiddleware(thunk));
const store = createStore(rootReducer, composedEnhancer);
export default store;

// f29: thunk
/*const asyncFunctionMiddleware = storeApi => next => action => {
    if (typeof action === 'function') {
        return action(storeApi.dispatch, storeApi.getState)
    }
    return next(action)
}*/

