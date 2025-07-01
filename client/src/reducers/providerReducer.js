import {
  GET_PROVIDER_PROFILE_SUCCESS,
  GET_PROVIDER_PROFILE_FAIL,
  UPDATE_PROVIDER_PROFILE_SUCCESS,
  UPDATE_PROVIDER_PROFILE_FAIL,
  UPLOAD_PROVIDER_PHOTO_FAIL,
  CLEAR_PROVIDER_PROFILE,
  GET_PROVIDERS_SUCCESS,
  GET_PROVIDERS_FAIL,
  SEARCH_PROVIDERS_SUCCESS,
  SEARCH_PROVIDERS_FAIL,
  PROVIDER_SET_LOADING,
  CLEAR_ERRORS,
  CLEAR_PROVIDERS,
  GET_PROVIDER,
  GET_PROVIDER_FAIL,
  GET_PROVIDER_STATS_SUCCESS,
  GET_PROVIDER_STATS_FAIL,
  STATS_LOADING,
  GET_PROVIDER_ACTIVITY_SUCCESS,
  GET_PROVIDER_ACTIVITY_FAIL,
  ACTIVITY_LOADING
} from '../actions/types';

const initialState = {
  profile: null,
  provider: {},
  providers: [], // Assuming this was for a list of providers, may not be relevant to single provider dashboard
  loading: false, // This is for profile loading usually
  error: null,
  // New state fields for stats and activity
  stats: {},
  activities: [],
  statsLoading: false,
  activityLoading: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case PROVIDER_SET_LOADING:
      return {
        ...state,
        loading: true
      };
    case CLEAR_PROVIDERS:
      return {
        ...state,
        providers: null,
        loading: false,
        error: null,
  };
    case GET_PROVIDER_PROFILE_SUCCESS:
      return {
        ...state,
        profile:action.payload,
        loading: false,
        error: null
      };
    case UPDATE_PROVIDER_PROFILE_SUCCESS:
      return{
        ...state,
       profile: action.payload,
       loading: false
      };
    case GET_PROVIDER:
      return{
        ...state,
        provider:action.payload,
        loading:false
      }
    case GET_PROVIDER_FAIL:
      return{
        ...state,
        loading: false,
        error : action.payload
      }
    case GET_PROVIDERS_SUCCESS:
    case SEARCH_PROVIDERS_SUCCESS:
      return {
        ...state,
        // Ensure providers is always an array, even if payload.data is missing or not an array.
        // The action now tries to ensure payload.data is correct, but this is an added safeguard.
        providers: Array.isArray(payload?.data) ? payload.data : [],
        loading: false,
        error: null
      };

    case GET_PROVIDER_PROFILE_FAIL:
    case UPDATE_PROVIDER_PROFILE_FAIL:
    case UPLOAD_PROVIDER_PHOTO_FAIL:
    case GET_PROVIDERS_FAIL:
    case SEARCH_PROVIDERS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };

    case CLEAR_PROVIDER_PROFILE:
      return {
        ...state,
        profile: null,
        loading: false,
        error: null
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };

    // New cases for stats and activity
    case STATS_LOADING:
      return {
        ...state,
        statsLoading: true
      };
    case GET_PROVIDER_STATS_SUCCESS:
      return {
        ...state,
        stats: payload,
        statsLoading: false,
        error: null
      };
    case GET_PROVIDER_STATS_FAIL:
      return {
        ...state,
        statsLoading: false,
        error: payload,
        stats: {}
      };

    case ACTIVITY_LOADING:
      return {
        ...state,
        activityLoading: true
      };
    case GET_PROVIDER_ACTIVITY_SUCCESS:
      return {
        ...state,
        activities: payload,
        activityLoading: false,
        error: null
      };
    case GET_PROVIDER_ACTIVITY_FAIL:
      return {
        ...state,
        activityLoading: false,
        error: payload,
        activities: []
      };

    default:
      return state;
  }
}