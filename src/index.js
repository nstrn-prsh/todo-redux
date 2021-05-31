import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import store from "./redux/store";
import { example, fetchTodos } from "./components/todos/todosSlice";

// f35
console.log(example);
console.log(example.toString());
console.log(example(6, 'foo'));
console.log(example.match(example(6, 'foo')));
// match(): be onvane vorodi action ro daryaft mikone va check mikone ke aya noeshon barabar hast ya na

store.dispatch(fetchTodos);

render(
     <React.StrictMode>
          <Provider store={store}>
               <App />
          </Provider>
     </React.StrictMode>,
     document.getElementById("root")
);
