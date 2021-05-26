import { useDispatch, useSelector } from "react-redux";
import {
     availableColors,
     colorFilterChanged,
     selectColorsFilter,
} from "./../todos/filterSlice";

const ColorFilters = () => {
     const colors = useSelector(selectColorsFilter);
     const dispatch = useDispatch();

     //f23: ye rang va inke bayad ezafe beshe ya bardashte beshe
     function handleChangeColor(color, changeType) {
          dispatch(colorFilterChanged(color, changeType));
     }

     const renderedColors = availableColors.map((color) => {
          const checked = colors.includes(color);
          const changeType = checked ? "color/removed" : "color/added";

          return (
               <label key={color}>
                    <input
                         type='checkbox'
                         name={color}
                         defaultChecked={checked}
                         onChange={() => handleChangeColor(color, changeType)}
                    />
                    <span
                         className='color-block'
                         style={{
                              backgroundColor: color,
                         }}
                    ></span>
                    {color}
               </label>
          );
     });

     return (
          <div className='filters colorFilters'>
               <h5>Filter by Color</h5>
               <form className='colorSelection'>{renderedColors}</form>
          </div>
     );
};

export default ColorFilters;
