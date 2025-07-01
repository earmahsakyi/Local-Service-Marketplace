import axios from 'axios';
import {
  GET_PROVIDER_SERVICES_SUCCESS,
  GET_PROVIDER_SERVICES_FAIL,
  ADD_PROVIDER_SERVICE_SUCCESS,
  ADD_PROVIDER_SERVICE_FAIL,
  UPDATE_PROVIDER_SERVICE_SUCCESS,
  UPDATE_PROVIDER_SERVICE_FAIL,
  DELETE_PROVIDER_SERVICE_SUCCESS,
  DELETE_PROVIDER_SERVICE_FAIL,
  SET_SERVICES_LOADING,
  CLEAR_SERVICE_ERROR
} from '../actions/types';

const getTokenConfig = () => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
};

export const getProviderServices = () => async (dispatch) => {
  dispatch(setServicesLoading());
  try {
    const res = await axios.get('/api/provider/services', getTokenConfig());
    dispatch({
      type: GET_PROVIDER_SERVICES_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_PROVIDER_SERVICES_FAIL,
      payload: err.response?.data?.msg || err.message || 'Failed to load services'
    });
  }
};

export const addProviderService = (serviceData) => async (dispatch) => {
  dispatch(setServicesLoading());
  try {
    const res = await axios.post('/api/provider/services', serviceData, getTokenConfig());
    dispatch({
      type: ADD_PROVIDER_SERVICE_SUCCESS,
      payload: res.data
    });
    return res.data; // Return the new service
  } catch (err) {
    dispatch({
      type: ADD_PROVIDER_SERVICE_FAIL,
      payload: err.response?.data?.msg || err.message || 'Failed to add service'
    });
    throw err; // Rethrow for error handling in component
  }
};

export const updateProviderService = (id, serviceData) => async (dispatch) => {
  dispatch(setServicesLoading());
  try {
    const res = await axios.put(`/api/provider/services/${id}`, serviceData, getTokenConfig());
    dispatch({
      type: UPDATE_PROVIDER_SERVICE_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: UPDATE_PROVIDER_SERVICE_FAIL,
      payload: err.response?.data?.msg || err.message || 'Failed to update service'
    });
  }
};

// New action, accepts providerId as parameter
export const getServicesByProviderId = (providerId) => async (dispatch) => {
  dispatch(setServicesLoading());
  try {
    const res = await axios.get(`/api/provider/services/services/${providerId}`);
    dispatch({
      type: GET_PROVIDER_SERVICES_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_PROVIDER_SERVICES_FAIL,
      payload: err.response?.data?.msg || err.message || 'Failed to load services'
    });
  }
};

export const deleteProviderService = (id) => async (dispatch) => {
  dispatch(setServicesLoading());
  try {
    await axios.delete(`/api/provider/services/${id}`, getTokenConfig());
    dispatch({
      type: DELETE_PROVIDER_SERVICE_SUCCESS,
      payload: id
    });
  } catch (err) {
    dispatch({
      type: DELETE_PROVIDER_SERVICE_FAIL,
      payload: err.response?.data?.msg || err.message || 'Failed to delete service'
    });
  }
};

export const setServicesLoading = () => ({
  type: SET_SERVICES_LOADING
});

export const clearServiceError = () => ({
  type: CLEAR_SERVICE_ERROR
});