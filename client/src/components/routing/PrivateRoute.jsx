import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Preloader from './Preloader';

const PrivateRoute = ({ element: Component }) => {
  const { isAuthenticated, loading, token } = useSelector((state) => state.auth);

  // If we're still loading and have a token, show loader
  if (loading && token) return <Preloader />;
  
  // If no token exists, redirect to login
  if (!token) return <Navigate to="/login" />;
  
  // If we have a token but auth check failed
  if (!isAuthenticated && token) return <Preloader />;

  // If authenticated, render the component
  return <Component />;
};

export default PrivateRoute;