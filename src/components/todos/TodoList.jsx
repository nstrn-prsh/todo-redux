import { shallowEqual, useSelector } from "react-redux";
import { selectFilterdTodoIds } from "./todosSlice";
import TodoListItem from "./TodoListItem";

const TodoList = () => {
     const todosIds = useSelector(selectFilterdTodoIds, shallowEqual);
     const loading = useSelector((state) => state.todos.status);

     if ("loading" === loading) {
          return (
               <div className='todo-list'>
                    <div className='loader'></div>
               </div>
          );
     }

     if ("error" === loading) {
          return <div>Error laoding todos</div>;
     }

     // f18
     /*const todos = useSelector(selectTodos)
     // note: tabdile object be araye baraye map kardan 
    const renderedListIttem key={id} todo={id} />
    })*/
     /*f19
      optimize: bejaye inke hameye todo haro begirim, faghat idio migirim ta vaghti ke toggle shod dg kole list render nashe
      const todoIds = useSelector(state=>Object.keys(state.todos.entities))
    const renderedListItems =todoIds.map((todoId) => {
        return <TodoListItem key={todoId} todo={todos[todoId]} />
    })*/

     const renderedListItems = todosIds.map((id) => {
          return <TodoListItem key={id} id={id} />;
     });

     return <ul className='todo-list'>{renderedListItems}</ul>;
};

export default TodoList;
