import { combineReducers } from "redux";
import authReducer from "./authReducer";
import providerReducer from "./providerReducer";
import serviceReducer from './serviceReducer';
import customerReducer from './customerReducer'
import alertReducer from "./alertReducer";

export default combineReducers({
    auth: authReducer,
    provider: providerReducer,
    service: serviceReducer,
    customer: customerReducer,
    alert: alertReducer,
});