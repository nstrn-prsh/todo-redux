import ColorFilters from "./ColorFilters";
import Actions from "./Actions";
import RemainingTodos from "./RemainingTodos";
import StatusFilter from "./StatusFilter";

/*f23
1. mishe maghadiro az valed daryaft kard
2. mostaghim be store vasl beshan harkodom va etelaato dispatch konan
* batavajoh be sharayete proje tasmim migirim
 */
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
