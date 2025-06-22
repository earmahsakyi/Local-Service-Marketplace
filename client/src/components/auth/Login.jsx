import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css/dist/js/materialize.min.js';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../actions/authAction';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    

    if(!formData.email || !formData.password) {
      M.toast({ html: 'All fields are required', classes: 'red' });
      return;
    }
    
    try {
      const result = await dispatch(login(formData));
      
      if (result?.success) {
       
  if (result.role === 'provider') {
    navigate(result.profileUpdated ? '/provider-page' : '/complete-provider-profile');
  } else if (result.role === 'customer') {
    navigate(result.profileUpdated ? '/customer-dashboard' : '/complete-customer-profile');
  }
}

    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="login-container"
    >
      {/* Back Button */}
      <button onClick={() => navigate('/')} className="btn-flat">
        <FaArrowLeft /> Back
      </button>

      <h4>Login to Your Account</h4>
      
      <form onSubmit={onSubmit}>
        {/* Email Field */}
        <div className="input-field">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
          />
          <label>Email</label>
        </div>

        {/* Password Field */}
        <div className="input-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={onChange}
            minLength={6}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
           {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
          <label>Password</label>
        </div>
        <div className="right-align">
         <Link to="/forgot-password">Forgot password?</Link>
          </div>

        <button 
          type="submit" 
          className="btn waves-effect"
          disabled={loading}
        >
          {loading ? <FaSpinner className="fa-spin" /> : 'Login'}
        </button>
      </form>

      <div className="center">
        <Link to="/register">Create new account</Link>
      </div>
    </motion.div>
  );
};

export default Login;