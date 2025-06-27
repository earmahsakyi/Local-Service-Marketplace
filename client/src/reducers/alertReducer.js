import { SET_ALERT, REMOVE_ALERT } from '../actions/alertAction';

   const initialState = {
     alert: null,
   };

   export default function alertReducer(state = initialState, action) {
     switch (action.type) {
       case SET_ALERT:
         return {
           ...state,
           alert: action.payload,
         };
       case REMOVE_ALERT:
         return {
           ...state,
           alert: null,
         };
       default:
         return state;
     }
   }