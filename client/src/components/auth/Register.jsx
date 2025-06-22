import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import M from 'materialize-css/dist/js/materialize.min.js';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, verifyEmail } from '../../actions/authAction';
import './Register.css';
import PreLoader from '../layouts/PreLoader';

const Register = () => {
  const dispatch = useDispatch();     
  const loading = useSelector(state => state.auth.loading);
  const navigate = useNavigate();

  // Form state
  const [user, setUser] = useState({ 
    email: '',
    password: '',
    password2: '',
    role: '',
  });

  // UI state
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    password2: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { email, password, password2, role } = user;

  // Validate email format
  const validateEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

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
    setUser({ ...user, [name]: value });

    // Real-time validation
    switch (name) {
      case 'email':
        setErrors({
          ...errors,
          email: !validateEmail(value) ? 'Invalid email format' : ''
        });
        break;
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
  if (email === '' || password==='' || password2 === ''){
    M.toast({html: "All fields are required!"});
    return;
  }

  try {
    const result = await dispatch(registerUser({ email, password, role }));
    
    // Check for error in result (not res.error)
    if (result?.error) {
      throw new Error(result.error);
    }

    // Only proceed if successful
    await dispatch(verifyEmail(email));
    setFeedback({ 
      type: 'success', 
      message: 'Registration successful! Please check your email.' 
    });
    
    // Navigate after state updates
    setTimeout(() => navigate('/verify-email'), 1000);
    
  } catch (err) {
    setFeedback({ 
      type: 'error', 
      message: err.message || 'Registration failed' 
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

      <h4 className="register-title">Create Your Account</h4>
      
      <form className="register-form card-panel" onSubmit={onSubmit}>
        {/* Email Field */}
        <div className="input-field">
          <input
            id="email"
            name="email"
            type="email"
            className={`validate ${errors.email ? 'invalid' : ''}`}
            value={email}
            onChange={onChange}
            autoFocus
            aria-label="Email address"
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
          />
          <label htmlFor="email" className={email ? 'active' : ''}>Email</label>
          {errors.email && (
            <span id="email-error" className="helper-text red-text">
              {errors.email}
            </span>
          )}
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

        {/* Role Selection */}
        <div className="role-selection">
          <span className="grey-text text-darken-2 role-label">Select Role</span>
          {errors.role && <span className="red-text">{errors.role}</span>}
          <div className="row">
            <div className="col s6">
              <label className="role-option">
                <input
                  name="role"
                  type="radio"
                  value="provider"
                  checked={role === 'provider'}
                  onChange={onChange}
                  className="with-gap"
                />
                <span>
                  <i className="material-icons">build</i> Provider
                </span>
              </label>
            </div>
            <div className="col s6">
              <label className="role-option">
                <input
                  name="role"
                  type="radio"
                  value="customer"
                  checked={role === 'customer'}
                  onChange={onChange}
                  className="with-gap"
                />
                <span>
                  <i className="material-icons">person</i> Customer
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="submit-button-wrapper">
          <button
            type="submit"
            className="btn waves-effect waves-light register-btn"
            disabled={loading}
          >
            {loading ? (
              <>
               
                <PreLoader />
              </>
            ) : (
              'Register'
            )}
          </button>
        </div>
      </form>

      {/* Login Link */}
      <div className="login-link-wrapper">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;