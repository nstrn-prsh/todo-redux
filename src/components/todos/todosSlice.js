/* eslint-disable default-case */
import { createSelector } from "reselect";
import { StatusFilters } from "./filterSlice";
import { client } from "../../api/client";
import { createAsyncThunk, createSlice, createReducer } from "@reduxjs/toolkit";

const initialState = {
     status: "idle",
     entities: {},
};

/*new: ghsmate dovome action.type be onvane esma tabe gharar migire va dar eine hal key ham hast
, toolkit khodesh action.type ro tashkhis mide*/
const todosSlice = createSlice({
     name: "todos",

     initialState,

     reducers: {
          todoAdded(state, action) {
               const todo = action.payload;
               state.entities[todo.id] = todo;
          },
          todoToggled(state, action) {
               const toggledTodoId = action.payload;
               state.entities[toggledTodoId].completed =
                    !state.entities[toggledTodoId].completed;
          },
          todoDeleted(state, action) {
               const deletedTodoId = action.payload;
               delete state.entities[deletedTodoId];
          },

          markAllCompleted(state) {
               Object.values(state.entities).forEach((todo) => {
                    state.entities[todo.id].completed = true;
               });
          },
          clearCompleted(state) {
               Object.values(state.entities).forEach((todo) => {
                    if (todo.completed) {
                         delete state.entities[todo.id];
                    }
               });
          },

          // note: ino nemitonim be sorate function vared konim va bayad object bashe pas barash key taiin mikonim
          // be khatere in motefavete ke bishtar az yeki payload dare
          // toye prepare() mitonim on logic marboot be payload (daghighan hamonjori ke to action factory hast) ro biarim
          colorChanged: {
               reducer(state, action) {
                    const { color, id } = action.payload;
                    state.entities[id].color = color;
               },
               prepare(todoId, color) {
                    return {
                         payload: {
                              id: todoId,
                              color,
                         },
                    };
               },
          },
     },
});

console.log(todosSlice);

// action factories
export const {
     todoAdded,
     todoToggled,
     todoDeleted,
     markAllCompleted,
     clearCompleted,
     colorChanged,
} = todosSlice.actions;

export default todosSlice.reducer;


export const saveNewTodo = (text) => {
     return async function saveNewTodoThunk(dispatch) {
          const initTodo = {
               text,
               completed: false,
          };
          //f30: ezafe kardane todo be server
          const todo = await client.post("todos", initTodo);
          dispatch(todoAdded(todo));
     };
};

//  daryafte todos az server
export const fetchTodos = createAsyncThunk(
     "todos/fetchTodos",
     async (params, thunkApi) => {
          return await client.get("todos");
     }
);

// f39
export const loadingStatus = createReducer(initialState, (builder) => {
     builder
          // fetchTodos.pending hamoon action type hast
          .addCase(fetchTodos.pending, (state, action) => {
               state.status = "pending";
          })
          .addCase(fetchTodos.fulfilled, (state, action) => {
               const todos = action.payload;
               const newEntities = {};
               todos.forEach((todo) => {
                    newEntities[todo.id] = todo;
               });
               state.entities = newEntities;
               state.status = "idle";
          })
          .addCase(fetchTodos.rejected, (state, action) => {
               state.status = "error";
          });
});

export const selectTodosIds = (state) => Object.keys(state.todos.entities);

export const selectTodoEntities = (state) => state.todos.entities;

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