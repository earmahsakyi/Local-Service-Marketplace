import { GET_CUSTOMERS_SUCCESS,GET_CUSTOMER_PROFILE_SUCCESS, GET_CUSTOMER_PROFILE_FAIL,
    UPDATE_CUSTOMER_PROFILE_SUCCESS,UPDATE_CUSTOMER_PROFILE_FAIL,
    CLEAR_CUSTOMER_PROFILE,GET_CUSTOMERS_FAIL,CLEAR_ERRORS,SET_LOADING
} from "./types";


// clear errors 
export const clearErrors = () => dispatch => {
    dispatch({type: CLEAR_ERRORS})
}
//Set Loading
export const setLoading = () => ({
    type: SET_LOADING
})