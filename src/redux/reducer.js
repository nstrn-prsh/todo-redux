import { combineReducers } from "redux";
import todoReducer from "./../components/todos/todosSlice";
import filterSlice from "./../components/todos/filterSlice";

const rootReducer = combineReducers({
     todos: todoReducer,
     filters: filterSlice,
});

export default rootReducer;
