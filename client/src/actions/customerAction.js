import { GET_CUSTOMERS_SUCCESS,GET_CUSTOMER_PROFILE_SUCCESS, GET_CUSTOMER_PROFILE_FAIL,
    UPDATE_CUSTOMER_PROFILE_SUCCESS,UPDATE_CUSTOMER_PROFILE_FAIL,
    CLEAR_CUSTOMER_PROFILE,GET_CUSTOMERS_FAIL,CLEAR_ERRORS,SET_LOADING
} from "./types";
import axios from 'axios'

//Get Current customer's profile
export const getCurrentCustomerProfile = () => async (dispatch) => {
    //dispatch(setLoading());
    try{
        const token = localStorage.getItem('token');
        if(!token){
            throw new Error('No authentication token found')
        }

        const config = {
            headers: {
                'x-auth-token' : token,
                'Content-Type': 'application/json'
            },
            timeout: 15000
        };
        const res = await axios.get('/api/customer/profile', config);
        if(!res.data || !res.data.success || !res.data.data ){
            throw new Error('Invalid response from sever')
        }
        dispatch({
            type: GET_CUSTOMER_PROFILE_SUCCESS,
            payload: res.data.data
        })
    }
    catch(err){
        let errorMessage = err.message || 'Unknown error occurred';
        if(err.code === 'ECONNABORTED'){
            errorMessage = "Request timeout. Please try again."

        }else if (err.response){
            errorMessage = err.response.data?.msg || err.response.data?.message || errorMessage
        }

        dispatch({
            type: GET_CUSTOMER_PROFILE_FAIL,
            payload: errorMessage
        })
    }
     
}

// create or update customer profile 
export const updateCustomerProfile = (formData) => async (dispatch) => {
    
    try{
        dispatch(setLoading())
        
        const config = {
            headers: {
                'Content-Type': 'application/json',


            }
        }
        const res = await axios.post('/api/customer',formData, config);

        dispatch({
            type: UPDATE_CUSTOMER_PROFILE_SUCCESS,
            payload: res.data.data
        });

        return res.data;
    }
    catch(err){
        dispatch({
            type: UPDATE_CUSTOMER_PROFILE_FAIL,
            payload: err.response?.data?.msg || 'Error updating profile'
        })
        throw err;

    }s
}

// Get all customers
export const getCustomers = () => async (dispatch) => {

    try{
        dispatch(setLoading())
        
        const res = await axios.get('/api/customers')

        dispatch({
            type: GET_CUSTOMERS_SUCCESS,
            payload: res.data
        });


    }
    catch(err){
        dispatch({
            type: GET_CUSTOMERS_FAIL,
            payload: err.response?.data?.msg || 'Error Loading customers'
        })
    }
}
// Clear customer profile
export const clearCustomerProfile = () => async (dispatch) => {
    dispatch({ type: CLEAR_CUSTOMER_PROFILE })
}

// clear errors 
export const clearErrors = () => dispatch => {
    dispatch({type: CLEAR_ERRORS})
}
//Set Loading
export const setLoading = () => ({
    type: SET_LOADING
})