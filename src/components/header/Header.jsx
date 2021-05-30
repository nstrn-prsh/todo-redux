import { useState } from "react";
import { useDispatch } from "react-redux";
import { saveNewTodo } from "./../todos/todosSlice";

export default function Header() {
     const [getText, setText] = useState("");
     // f32
     const [getStatus, setStatus] = useState("idle");

     const dispatch = useDispatch();

     const handleChanges = (e) => setText(e.target.value);

     // dispatch kardane value
     const handleKeyDown = async (e) => {
          // trim() space ghabool nemikone
          const trimmedText = getText.trim();
          //note: 13 yani Enter
          if (e.which === 13 && trimmedText) {
               setStatus("loading");
               await dispatch(saveNewTodo(trimmedText));
               setText("");
               setStatus("idle");
          }
     };

     const isLoading = "loading" === getStatus;
     const placeholder = isLoading ? "" : "What needs to be done?";
     const loader = isLoading ? <div className='loader'></div> : null;

     return (
          <header className='header'>
               <input
                    className='new-todo'
                    placeholder={placeholder}
                    value={getText}
                    onChange={handleChanges}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
               />
               {loader}
          </header>
     );
}
