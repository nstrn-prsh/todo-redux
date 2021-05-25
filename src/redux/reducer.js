import { combineReducers } from "redux";
import todoReducer from "./../components/todos/todosSlice";
import filterSlice from "./../components/filter/filterSlice";

const rootReducer = combineReducers({
     todos: todoReducer,
     filters: filterSlice,
});

export default rootReducer;
