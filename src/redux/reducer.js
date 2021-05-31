import todosSlice from "./../components/todos/todosSlice";
import filterSlice from "./../components/todos/filterSlice";
// import { combineReducers } from "redux";

const reducer = {
     todos: todosSlice,
     filters: filterSlice,
}

export default reducer;
