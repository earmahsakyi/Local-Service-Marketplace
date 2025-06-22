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

const initialState = {
  services: [],
  loading: false,
  error: null
};

export default function serviceReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROVIDER_SERVICES_SUCCESS:
      return {
        ...state,
        services: payload,
        loading: false,
        error: null
      };
    case ADD_PROVIDER_SERVICE_SUCCESS:
      if (!payload._id) {
        console.warn('Invalid service added:', payload);
        return state; // Skip invalid service
      }
      return {
        ...state,
        services: [...state.services, payload],
        loading: false,
        error: null
      };
    case UPDATE_PROVIDER_SERVICE_SUCCESS:
      return {
        ...state,
        services: state.services.map(service =>
          service._id === payload._id ? payload : service
        ),
        loading: false,
        error: null
      };
    case DELETE_PROVIDER_SERVICE_SUCCESS:
      return {
        ...state,
        services: state.services.filter(service => service._id !== payload),
        loading: false,
        error: null
      };
    case SET_SERVICES_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PROVIDER_SERVICES_FAIL:
    case ADD_PROVIDER_SERVICE_FAIL:
    case UPDATE_PROVIDER_SERVICE_FAIL:
    case DELETE_PROVIDER_SERVICE_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    case CLEAR_SERVICE_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
}