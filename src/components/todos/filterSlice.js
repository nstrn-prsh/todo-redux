/* eslint-disable default-case */
import produce from "immer";

export const StatusFilters = {
     All: "all",
     Active: "active",
     Completed: "completed",
};

const initState = {
     status: StatusFilters.All,
     colors: [],
};

// f23
const filterReducer = produce((state, action) => {
     switch (action.type) {
          case "filters/statusFilterChanged":
               state.status = action.payload;
               break;
          /*return{
                   ...state,
                   status: action.payload
               }*/

          //new:    ezafe kardan va bardashtane rang
          case "filters/colorFilterChanged":
               const { colors } = state;
               const { color, changeType } = action.payload;
               switch (changeType) {
                    case "color/added":
                         state.colors.push(color);
                         break;
                    case "color/removed":
                         state.colors = colors.filter((c) => c !== color);
                         break;
               }
               break;
          /*switch (changeType) {
                    case "added":
                         if(colors.includes(color)) return state
                         return{
                             ...state,
                             colors: [...colors, color]
                         }
                    case "removed":
                         return{
                             ...state, 
                             colors: colors.filter(c=>c!== color)
                         }
               }*/
     }
}, initState);

export default filterReducer;

/* ***** ACTION FACTORIES ***** */

//f23: components/footer/StatusFilter.jsx --> useSelector
export const selectStatusFilter = (state) => state.filters.status;
//f23: components/footer/ColorFilter.jsx --> useSelector
export const selectColorsFilter = (state) => state.filters.colors;

//components/footer/StatusFilter.jsx --> handleChangeStatus(status)
export const statusFilterChanged = (status) => ({
     type: "filters/statusFilterChanged",
     payload: status,
});

//f23: components/footer/ColorFilter.jsx --> handleChangeColor(color, changeType)
export const colorFilterChanged = (color, changeType) => ({
     type: "filters/colorFilterChanged",
     payload: {
          color,
          changeType,
     },
});
