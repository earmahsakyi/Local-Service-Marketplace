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
  PROVIDER_SET_LOADING,
  CLEAR_ERRORS,
  GET_PROVIDER,
  GET_PROVIDER_FAIL,
  CLEAR_PROVIDERS,
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
    dispatch(setProviderLoading());

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
    dispatch(setProviderLoading());

    const res = await axios.get('/api/provider');

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

// Clear provider profile
export const clearProviderProfile = () => (dispatch) => {
  dispatch({ type: CLEAR_PROVIDER_PROFILE });
};

// Clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

export const clearProviders = () => (dispatch) => {
  dispatch({type: CLEAR_PROVIDERS})
}

// Set loading
export const setProviderLoading = () => ({
  type: PROVIDER_SET_LOADING
});
// search Providers
export const searchProviders = (criteria) => async (dispatch) => {
  try {
    dispatch(setProviderLoading());

    const token = localStorage.getItem('token');
    const config = {
      params: criteria,
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      timeout: 15000 // Add a 15-second timeout (15000 milliseconds)
    };
    
    console.log('Searching providers with criteria:', criteria, 'and config:', config); // More detailed log
    const res = await axios.get('/api/provider/search', config);

    console.log('Search response:', res.data);

    // Ensure res.data and res.data.data exist and res.data.data is an array
    // The reducer for SEARCH_PROVIDERS_SUCCESS expects action.payload.data to be the array of providers.
    // So, res.data itself should be an object like { data: [...] }
    if (!res.data || !Array.isArray(res.data.data)) {
      console.error('Search response error: res.data or res.data.data is not in expected format.', res.data);
      throw new Error('Received an invalid response structure from the server.'); 
    }

    dispatch({
      type: SEARCH_PROVIDERS_SUCCESS,
      payload: res.data // The reducer expects payload.data to be the array
    });

    return res.data;

  } catch (err) {
    console.error('Search error:', err); // Log the full error object
    
    let errorMessage = 'Error searching providers. Please try again.';
    if (err.code === 'ECONNABORTED') {
      errorMessage = 'The search request timed out. Please check your connection and try again.';
      console.error('Search timed out:', err.message);
    } else if (err.message === 'Received an invalid response structure from the server.') {
      errorMessage = err.message; // Use the specific error message
    } else if (err.response) {
      errorMessage = err.response.data?.msg || err.response.data?.message || `Server error: ${err.response.status}`;
      console.error('Server error response:', err.response.data || err.response.status);
    } else if (err.request) {
      errorMessage = 'Network error - no response received. Please check your connection.';
      console.error('Network error (no response):', err.request);
    } else {
      // This handles errors during request setup or other unexpected errors
      errorMessage = err.message || 'An unexpected error occurred during search.';
      console.error('Request setup or other error:', err.message);
    }

    dispatch({
      type: SEARCH_PROVIDERS_FAIL,
      payload: errorMessage
    });
    
    // Optionally, re-throw if components need to react to the error object itself,
    // but for resetting loading state, dispatching _FAIL is key.
    // throw err; // Commented out as dispatching FAIL is usually sufficient for UI.
  }
};
//get providerbyID
export const getProviderById = (id) => async (dispatch) => {

  try{
     dispatch(setProviderLoading())
     const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

     const res = await axios.get(`/api/provider/${id}`, config)
     dispatch({
      type: GET_PROVIDER,
      payload: res.data.data
    })
  }
  catch(err){
    dispatch({
      type: GET_PROVIDER_FAIL,
      payload: err.response?.data?.msg || 'Error loading provider'
    });
  }
}
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