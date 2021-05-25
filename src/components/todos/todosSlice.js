/* eslint-disable default-case */
import produce from "immer";
import { createSelector } from "reselect";
import { StatusFilters } from "../filter/filterSlice";
import { client } from "../../api/client";

const initState = {
     status: "idle",
     entities: {},
};

const todosReducer = produce((state, action) => {
     switch (action.type) {
          //f17
          case "todos/todoAdded":
               const todo = action.payload;
               state.entities[todo.id] = todo;
               break;
          // const todo = action.payload;
          //    return {
          //         ...state,
          //         entities: [...state.entities, todo],
          //    };
          case "todos/todoToggled":
               const toggledTodoId = action.payload;
               state.entities[toggledTodoId].completed =
                    !state.entities[toggledTodoId].completed;
               break;
          // const toggledTodoId = action.payload;
          //    return {
          //         ...state,
          //         entities: state.entities.map((todo) => {
          //              if (todo.id === toggledTodoId) {
          //                   return {
          //                        ...todo,
          //                        completed: !todo.completed,
          //                   };
          //              }
          //              return todo;
          //         }),
          //    };
          case "todos/todoDeleted":
               const deletedTodoId = action.payload;
               delete state.entities[deletedTodoId];
               break;
          //    const deletedTodoId = action.payload;
          //    return {
          //         ...state,
          //         entities: state.entities.filter(
          //              (todo) => todo.id !== deletedTodoId
          //         ),
          //    };

          case "todos/markAllCompleted":
               Object.values(state.entities).forEach((todo) => {
                    state.entities[todo.id].completed = true;
               });
               break;
          case "todos/clearCompleted":
               Object.values(state.entities).forEach((todo) => {
                    if (todo.completed) {
                         delete state.entities[todo.id];
                    }
               });
               break;

          case "todos/colorChanged":
               const { color, id } = action.payload;
               state.entities[id].color = color;
               break;

          case "todos/todosLoadingStarted":
               state.status = "loading";
               break;
          case "todos/todosLoadedSuccess":
               const todos = action.payload;
               const newEntities = {};
               todos.forEach((todo) => {
                    newEntities[todo.id] = todo;
               });
               state.entities = newEntities;
               state.status = "idle";
               break;
          case "todos/todosLoadedFailes":
               state.status = "error";
     }
}, initState);

export default todosReducer;

// optimize:
/* ***** ACTION FACTORIES ***** */
// be jaye inke toye dispatch action o payload ro benevisim
// inja be sorate tabe minevisim ke khatamoonam kamtar beshe

export const todoAdded = (todo) => ({
     type: "todos/todoAdded",
     payload: todo,
});

export const todoToggled = (todoId) => ({
     type: "todos/todoToggled",
     payload: todoId,
});

export const todoDeleted = (todoId) => ({
     type: "todos/todoDeleted",
     payload: todoId,
});

export const markAllCompleted = () => ({
     type: "todos/markAllCompleted",
});

export const clearCompleted = () => ({
     type: "todos/clearCompleted",
});

export const colorChanged = (todoId, color) => ({
     type: "todos/colorChanged",
     payload: {
          id: todoId,
          color,
     },
});

const todosLoadingStarted = (todos) => ({
     type: "todos/todosLoadingStarted",
});

const todosLoadedSuccess = (todos) => ({
     type: "todos/todosLoadedSuccess",
     payload: todos,
});

const todosLoadedFailes = () => ({
     type: "todos/todosLoadedFailes",
});

// thunk function

//f17: components/Header/header.jsx -->handleKeyDown
// export const todoAdded = (text) => ({
//      type: "todos/todoAdded",
//      payload: { id: 6, text, completed: false },
// });

export const saveNewTodo = (text) => {
     return async function saveNewTodoThunk(dispatch) {
          const initTodo = {
               text,
               completed: false,
          };
          const todo = await client.post("todos", initTodo);
          dispatch(todoAdded(todo));
     };
};

export const fetchTodos = (dispatch, getState) => {
     dispatch(todosLoadingStarted());
     client
          .get("todos")
          .then((todos) => {
               dispatch(todosLoadedSuccess(todos));
          })
          .catch((error) => todosLoadedFailes());
};

export const selectTodosIds = (state) => Object.keys(state.todos.entities);

export const selectTodoEntities = (state) => state.todos.entities;

export const selectTodos = createSelector(selectTodoEntities, (todoEntities) =>
     Object.values(todoEntities)
);

// f17: components/todos/TodoList.jsx --> todosIds
// export const selectTodos = state=>state.todos.entities

const selectFilteredTodos = createSelector(
     selectTodos,
     (state) => state.filters,
     (todos, filters) => {
          const { status, colors } = filters;
          const showAll = status === StatusFilters.All;

          if (showAll && colors.length === 0) {
               return todos;
          }

          const showCompleted = status === StatusFilters.Completed;
          return todos.filter((todo) => {
               const statusFilter = showAll || todo.completed === showCompleted;
               const colorsFilter =
                    colors.length === 0 || colors.includes(todo.color);

               return statusFilter && colorsFilter;
          });
     }
);

export const selectFilterdTodoIds = createSelector(
     selectFilteredTodos,
     (filteredTodos) => filteredTodos.map((todo) => todo.id)
);
