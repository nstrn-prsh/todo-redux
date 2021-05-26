/* eslint-disable default-case */
import produce from "immer";
import { createSelector } from "reselect";
import { StatusFilters } from "./filterSlice";
import { client } from "../../api/client";

const initState = {
     status: "idle",
     entities: {},
};

//f22: immer
// araye
// object
const todosReducer = produce((state, action) => {
     switch (action.type) {
          //f17
          case "todos/todoAdded":
               const todo = action.payload;
               state.entities[todo.id] = todo;
               break;
          /*const todo = action.payload;
             return {
                  ...state,
                  entities: [...state.entities, todo],
             };*/
          /*const todo = action.payload
             return {
                 ...state,
                 entities: {
                     ...state.entities,
                     [todo.id]: todo
                 }
             }*/

          case "todos/todoToggled":
               const toggledTodoId = action.payload;
               state.entities[toggledTodoId].completed =
                    !state.entities[toggledTodoId].completed;
               break;
          /*const toggledTodoId = action.payload;
             return {
                  ...state,
                  entities: state.entities.map((todo) => {
                       if (todo.id === toggledTodoId) {
                            return {
                                 ...todo,
                                 completed: !todo.completed,
                            };
                       }
                       return todo;
                  }),
             };*/
          /*const todoToggled = state.entities[toggledTodoId]
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [toggledTodoId]: {
                        ...todoToggled,
                        completed: !todoToggled.completed
                    }
                }
            }*/
          case "todos/todoDeleted":
               const deletedTodoId = action.payload;
               delete state.entities[deletedTodoId];
               break;
          /*const deletedTodoId = action.payload;
             return {
                  ...state,
                  entities: state.entities.filter(
                       (todo) => todo.id !== deletedTodoId
                  ),
             };*/
          /*const entities = { ...state.entities }
            delete entities[deletedTodoId]
            return {
                ...state,
                entities
            }*/

          //   f26
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

          // f26
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
          case "todos/todosLoadedFails":
               state.status = "error";
     }
}, initState);

export default todosReducer;

/*optimize: ***** ACTION FACTORIES ***** */
// be jaye inke toye dispatch action o payload ro benevisim
// inja be sorate tabe minevisim ke khatamoonam kamtar beshe

export const todoAdded = (todo) => ({
     type: "todos/todoAdded",
     payload: todo,
});

// f18: components/todos/TodoListItem.jsx --> handleCompletedChanged
export const todoToggled = (todoId) => ({
     type: "todos/todoToggled",
     payload: todoId,
});

// f18: components/todos/TodoListItem.jsx --> handleDelete
export const todoDeleted = (todoId) => ({
     type: "todos/todoDeleted",
     payload: todoId,
});

// f26: components/footer/Actions.jsx -->onMarkAllCompletedClick
export const markAllCompleted = () => ({
     type: "todos/markAllCompleted",
});

// f26: components/footer/Actions.jsx -->onClearCompletedClick
export const clearCompleted = () => ({
     type: "todos/clearCompleted",
});

// f26: components/todos/TodoListItem/jsx --> handleChangeColor
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

const todosLoadedFails = () => ({
     type: "todos/todosLoadedFails",
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
          .catch((error) => todosLoadedFails());
};

export const selectTodosIds = (state) => Object.keys(state.todos.entities);

export const selectTodoEntities = (state) => state.todos.entities;

// new: after using reselect:
// ye seri selector ro be onvane parametr be sorate taki ya araye migire
// ejrashon mikone va state ro beheshon pas mide va khrojio return mikone toye ye tabe
// optimize: age todoEntities taghiri nakone, Object.values(todoEntities) dobare mohasebe nemishe
export const selectTodos = createSelector(
     selectTodoEntities,
     //note: hamye object haro be araye tabdil mikonim
     (todoEntities) => Object.values(todoEntities)
);

//f24: Todos ro select mikone bar mabnaye filter boodan
const selectFilteredTodos = createSelector(
     selectTodos,
     (state) => state.filters,
     (todos, filters) => {
          const { status, colors } = filters;
          // age filter all bood va color select nashode bood hameye todo haro bayad namayesh bedim
          const showAll = status === StatusFilters.All;
          if (showAll && colors.length === 0) {
               return todos;
          }
          // age rang ham entekhab karde bood bayad hardota filtero barresi konim
          // Completed ya true hast ya fasle . age false bashe yani Active hast
          const showCompleted = status === StatusFilters.Completed;
          return todos.filter((todo) => {
               const statusFilter = showAll || todo.completed === showCompleted;
               const colorsFilter =
                    colors.length === 0 || colors.includes(todo.color);
               return statusFilter && colorsFilter;
          });
     }
);

//keys (id) ro select mikone
// f24: components/todos/TodoList.jsx --> useSelector
export const selectFilteredTodoIds = createSelector(
     selectFilteredTodos,
     (filteredTodos) => filteredTodos.map((todo) => todo.id)
);

// f17: components/todos/TodoList.jsx --> useSelector
// export const selectTodos = state=>state.todos.entities

// before using reselect
/*f24
const selectFilteredTodos = (state) => {
     const todos = Object.values(selectTodos(state));
     const { status, colors } = state.filters;
     const showAll = status === StatusFilters.All;
     if (showAll && colors.length === 0)
          return todos;
     const showCompleted = status === StatusFilters.Completed;
     return todos.filter((todo) => {
          const statusFilter = showAll || todo.completed === showCompleted;
          const colorsFilter =
               colors.length === 0 || colors.includes(todo.color);
          return statusFilter && colorsFilter;
     });
};

export const selectFilteredTodoIds = (state) =>
     selectFilteredTodos(state).map((todo) => todo.id);
     */
