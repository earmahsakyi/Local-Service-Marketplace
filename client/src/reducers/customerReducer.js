import { GET_CUSTOMERS_SUCCESS,GET_CUSTOMER_PROFILE_SUCCESS, GET_CUSTOMER_PROFILE_FAIL,
    UPDATE_CUSTOMER_PROFILE_SUCCESS,UPDATE_CUSTOMER_PROFILE_FAIL,
    CLEAR_CUSTOMER_PROFILE,GET_CUSTOMERS_FAIL,CLEAR_ERRORS,CUSTOMER_SET_LOADING
} from "../actions/types";

const initialState = {
    profile: null,
  customers: [], 
  loading: false, 
  error: null,
}

const customerReducer = (state = initialState, action) => {

    switch(action.type) {
        case CUSTOMER_SET_LOADING:
            return{
                ...state,
                loading: true
            };
        case GET_CUSTOMER_PROFILE_SUCCESS:
            return{
                ...state,
                profile: action.payload,
                loading: false,
                error: null
            }
        case GET_CUSTOMERS_FAIL:
        case GET_CUSTOMER_PROFILE_FAIL:
        case UPDATE_CUSTOMER_PROFILE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case GET_CUSTOMERS_SUCCESS:
            return{
                ...state,
                customers: action.payload,
                loading: false,
                error: null
            }
        case UPDATE_CUSTOMER_PROFILE_SUCCESS:
            return {
                ...state,
                profile: action.payload,
                loading: false,
                error: null
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        case CLEAR_CUSTOMER_PROFILE:
            return{
                ...state,
                profile: null,
                loading: false,
                error : null
            }
        default:
            return state
    }

}

export default customerReducer;