import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import store from "./redux/store";
import { fetchTodos } from "./components/todos/todosSlice";

store.dispatch(fetchTodos);

render(
     <React.StrictMode>
          <Provider store={store}>
               <App />
          </Provider>
     </React.StrictMode>,
     document.getElementById("root")
);
