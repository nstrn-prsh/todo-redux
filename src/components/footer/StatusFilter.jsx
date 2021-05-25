import { useSelector, useDispatch } from "react-redux";
import {
     selectStatusFilter,
     statusFilterChanged,
     StatusFilters,
} from "./../todos/filterSlice";

const StatusFilter = () => {
     const status = useSelector(selectStatusFilter);

     const dispatch = useDispatch();

     function handlChangeStatus(status) {
          dispatch(statusFilterChanged(status));
     }

     //note: key haro migire az to object va be araye tabdil mikonim va roshon map mizanim
     const renderedFilters = Object.keys(StatusFilters).map((key) => {
          // value: all, active, completed
          const value = StatusFilters[key];
          // kodom filter bayad bashe?
          const className = value === status ? "selected" : "";

          return (
               <li key={value}>
                    <button
                         className={className}
                         onClick={() => handlChangeStatus(value)}
                    >
                         {key}
                    </button>
               </li>
          );
     });

     return (
          <div className='filters statusFilters'>
               <h5>Filter by Status</h5>
               <ul>{renderedFilters}</ul>
          </div>
     );
};

export default StatusFilter;
