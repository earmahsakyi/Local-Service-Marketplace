import { GET_CUSTOMERS_SUCCESS,GET_CUSTOMER_PROFILE_SUCCESS, GET_CUSTOMER_PROFILE_FAIL,
    UPDATE_CUSTOMER_PROFILE_SUCCESS,UPDATE_CUSTOMER_PROFILE_FAIL,
    CLEAR_CUSTOMER_PROFILE,GET_CUSTOMERS_FAIL,CLEAR_ERRORS,SET_LOADING
} from "../actions/types";

const initialState = {
    profile: null,
  customers: [], 
  loading: false, 
  error: null,
}

const customerReducer = (state = initialState, action) => {

    switch(action.type) {
        case SET_LOADING:
            return{
                ...state,
                loading: true
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }

}

export default customerReducer;