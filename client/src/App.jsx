import React, { useEffect } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerPage from './components/pages/CustomerPage';
import ForgotPassword from './components/auth/ForgotPassword';
import PrivateRoute from './components/routing/PrivateRoute';
import ResetPassword from './components/auth/ResetPassword';
import ProviderPage from './components/pages/ProviderPage';
import UpdateProfile from './components/provider/UpdateProfile';
import UpdateProfileCustomer from './components/customer/UpdateProfileCustomer';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import ProviderDetail from './components/provider/ProviderDetail';
import VerifyEmail from './components/auth/VerifyEmail';
import Home from './components/pages/Home';
import editProfile from './components/provider/editProfile'
import MyBookingsPlaceholder from './components/provider/MyBookingsPlaceholder';
import ProviderServicesPage from './components/pages/ProviderServicesPage';
import Store from './store';
import { Provider, useDispatch } from 'react-redux';
import { loadUser } from './actions/authAction'; 
import './App.css';

const AppInner = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    M.AutoInit();

    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/customer-page" element={<PrivateRoute element={CustomerPage} />} />
      <Route path="/complete-provider-profile" element={<PrivateRoute element={UpdateProfile} />} />
      <Route path="/provider-edit-profile" element={<PrivateRoute element={editProfile} />} />
      <Route path="/complete-customer-profile" element={<PrivateRoute element={UpdateProfileCustomer} />} />
      <Route path="/provider-page" element={<PrivateRoute element={ProviderPage} />} />
      <Route path="/provider/:id" element={<PrivateRoute element={ProviderDetail} />} />
      <Route path="/provider/bookings" element={<PrivateRoute element={MyBookingsPlaceholder} />} />
      <Route path="/provider/services" element={<PrivateRoute element={ProviderServicesPage} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Provider store={Store}>
      <Router>
        <AppInner />
      </Router>
    </Provider>
  );
};

export default App;
