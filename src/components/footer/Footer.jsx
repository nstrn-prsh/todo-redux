import ColorFilters from "./ColorFilters";
import Actions from "./Actions";
import RemainingTodos from "./RemainingTodos";
import StatusFilter from "./StatusFilter";

export default function Footer() {
     return (
          <footer className='footer'>
               <Actions />
               <RemainingTodos />
               <StatusFilter />
               <ColorFilters />
          </footer>
     );
}
