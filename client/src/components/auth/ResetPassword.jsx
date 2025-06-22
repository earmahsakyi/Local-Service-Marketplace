import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import M from 'materialize-css/dist/js/materialize.min.js';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../actions/authAction';
import './Register.css';
import PreLoader from '../layouts/PreLoader';

const ResetPassword = () => {
  const dispatch = useDispatch();     
  const loading = useSelector(state => state.auth.loading);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('email')

  // Form state
  const [formData, setFormData] = useState({
    token: '',
    password: '',
    password2: '',
    
  });

  // UI state
  const [errors, setErrors] = useState({
    token: '',
    password: '',
    password2: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {  token, password, password2 } = formData;
 

  // Check password strength
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  // Handle input changes with validation
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation
    switch (name) {
      case 'password':
        setErrors({
          ...errors,
          password: value.length < 6 ? 'Password must be 6+ characters' : ''
        });
        setPasswordStrength(checkPasswordStrength(value));
        break;
      case 'password2':
        setErrors({
          ...errors,
          password2: value !== password ? 'Passwords do not match' : ''
        });
        break;
    }
  };

  // Form submission
  const onSubmit = async (e) => {
  e.preventDefault();
  
  // ... (keep your validation checks)
  if (token === '' || password==='' || password2 === ''){
    M.toast({html: "All fields are required!"});
    return;
  }

  try {
    
    const result = await dispatch(resetPassword(userEmail, token, password));
    
    if(result.success){
        setFeedback({ 
      type: 'success', 
      message: 'Password Reset successful! ' 
    });
         // Navigate after state updates
    setTimeout(() => navigate('/login'), 1000);
    }
    
   
    
  } catch (err) {
    setFeedback({ 
      type: 'error', 
      message: err.message || 'Password Reset failed' 
    });
  }
};

  // Initialize Materialize components
  useEffect(() => {
    M.updateTextFields();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="register-container"
    >
      {/* Back Button */}
      <button
        className="back-to-home btn-flat"
        onClick={() => navigate('/')}
        aria-label="Go back to home"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Feedback Message */}
      {feedback.message && (
        <div className={`card-panel ${feedback.type === 'success' ? 'green lighten-4' : 'red lighten-4'}`}>
          {feedback.message}
        </div>
      )}

      <h4 className="register-title">Reset Password</h4>
      
      <form className="register-form card-panel" onSubmit={onSubmit}>
        <div className="input-field">
          <input
                type="text"
                id="token"
                value={token}
                name='token'
                onChange={onChange}
                className="validate"
                
              />
          <label htmlFor="token" className={token ? 'active' : ''} >Code</label>
        </div>

        {/* Password Field */}
        <div className="input-field">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            className={`validate ${errors.password ? 'invalid' : ''}`}
            value={password}
            onChange={onChange}
            aria-label="Password"
            aria-invalid={!!errors.password}
            aria-describedby="password-error"
          />
          <label htmlFor="password" className={password ? 'active' : ''}>Password</label>
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.password && (
            <span id="password-error" className="helper-text red-text">
              {errors.password}
            </span>
          )}
          {password && (
            <div className="password-strength">
              <div className={`strength-bar ${passwordStrength > 0 ? 'active' : ''}`}></div>
              <div className={`strength-bar ${passwordStrength > 1 ? 'active' : ''}`}></div>
              <div className={`strength-bar ${passwordStrength > 2 ? 'active' : ''}`}></div>
              <div className={`strength-bar ${passwordStrength > 3 ? 'active' : ''}`}></div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="input-field">
          <input
            id="password2"
            name="password2"
            type={showPassword ? "text" : "password"}
            className={`validate ${errors.password2 ? 'invalid' : ''}`}
            value={password2}
            onChange={onChange}
            aria-label="Confirm Password"
            aria-invalid={!!errors.password2}
            aria-describedby="password2-error"
          />
          <label htmlFor="password2" className={password2 ? 'active' : ''}>Confirm Password</label>
          {errors.password2 && (
            <span id="password2-error" className="helper-text red-text">
              {errors.password2}
            </span>
          )}
        </div>
        <div className="submit-button-wrapper">
          <button
            type="submit"
            className="btn waves-effect waves-light register-btn"
            disabled={loading}
          >
            {loading ? (
                <FaSpinner className="fa-spin" />
            ) : (
              'Reset Password'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ResetPassword;