// UPDATED providerAction.js with extensive debugging
import axios from 'axios';
import {
  GET_PROVIDER_PROFILE_SUCCESS,
  GET_PROVIDER_PROFILE_FAIL,
  UPDATE_PROVIDER_PROFILE_SUCCESS,
  UPDATE_PROVIDER_PROFILE_FAIL,
  CLEAR_PROVIDER_PROFILE,
  GET_PROVIDERS_SUCCESS,
  GET_PROVIDERS_FAIL,
  SEARCH_PROVIDERS_SUCCESS,
  SEARCH_PROVIDERS_FAIL,
  SET_LOADING,
  CLEAR_ERRORS,
  // New types for stats and activity
  GET_PROVIDER_STATS_SUCCESS,
  GET_PROVIDER_STATS_FAIL,
  STATS_LOADING,
  GET_PROVIDER_ACTIVITY_SUCCESS,
  GET_PROVIDER_ACTIVITY_FAIL,
  ACTIVITY_LOADING
} from './types';

// Helper to get auth token (if not already globally available or imported)
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

// Get current provider's profile
export const getCurrentProviderProfile = () => async (dispatch) => {
 

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const config = {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json'
      },
      timeout: 15000 // Add a 15-second timeout
    };

    const res = await axios.get('/api/provider/profile', config);

    if (!res.data || !res.data.success || !res.data.data) {
      throw new Error('Invalid response from server');
    }

    dispatch({
      type: GET_PROVIDER_PROFILE_SUCCESS,
      payload: res.data.data
    });

  } catch (err) {
    let errorMessage = err.message || 'Unknown error occurred';
    if (err.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Please try again.';
    } else if (err.response) {
      errorMessage = err.response.data?.msg || err.response.data?.message || errorMessage;
    }

    dispatch({
      type: GET_PROVIDER_PROFILE_FAIL,
      payload: errorMessage
    });
  }
};

// Create or update provider profile
export const updateProviderProfile = (formData) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const res = await axios.post('/api/provider', formData, config);

    dispatch({
      type: UPDATE_PROVIDER_PROFILE_SUCCESS,
      payload: res.data.data
    });

    return res.data;

  } catch (err) {
    dispatch({
      type: UPDATE_PROVIDER_PROFILE_FAIL,
      payload: err.response?.data?.msg || 'Error updating profile'
    });
    throw err;
  }
};

// Get all providers
export const getProviders = () => async (dispatch) => {
  try {
    dispatch(setLoading());

    const res = await axios.get('/api/providers');

    dispatch({
      type: GET_PROVIDERS_SUCCESS,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: GET_PROVIDERS_FAIL,
      payload: err.response?.data?.msg || 'Error loading providers'
    });
  }
};

// Search providers
export const searchProviders = (criteria) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const res = await axios.get('/api/providers/search', {
      params: criteria
    });

    dispatch({
      type: SEARCH_PROVIDERS_SUCCESS,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: SEARCH_PROVIDERS_FAIL,
      payload: err.response?.data?.msg || 'Error searching providers'
    });
  }
};

// Clear provider profile
export const clearProviderProfile = () => (dispatch) => {
  dispatch({ type: CLEAR_PROVIDER_PROFILE });
};

// Clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

// Set loading
export const setLoading = () => ({
  type: SET_LOADING
});

// Set Stats Loading
export const setStatsLoading = () => (dispatch) => {
  dispatch({ type: STATS_LOADING });
};

// Get Provider Stats
export const getProviderStats = () => async (dispatch) => {
  dispatch(setStatsLoading());
  try {
    const res = await axios.get('/api/provider/stats', getTokenConfig()); // API from Step 1
    dispatch({
      type: GET_PROVIDER_STATS_SUCCESS,
      payload: res.data // Assuming API returns stats object
    });
  } catch (err) {
    dispatch({
      type: GET_PROVIDER_STATS_FAIL,
      payload: err.response?.data?.msg || err.message || 'Failed to fetch stats'
    });
  }
};

// Set Activity Loading
export const setActivityLoading = () => (dispatch) => {
  dispatch({ type: ACTIVITY_LOADING });
};

// Get Provider Activity
export const getProviderActivity = () => async (dispatch) => {
  dispatch(setActivityLoading());
  try {
    const res = await axios.get('/api/provider/activity', getTokenConfig()); // API from Step 1
    dispatch({
      type: GET_PROVIDER_ACTIVITY_SUCCESS,
      payload: res.data // Assuming API returns array of activities
    });
  } catch (err) {
    dispatch({
      type: GET_PROVIDER_ACTIVITY_FAIL,
      payload: err.response?.data?.msg || err.message || 'Failed to fetch activity'
    });
  }
};