import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import M from 'materialize-css/dist/js/materialize.min.js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PreLoader from '../layouts/PreLoader';
import { confirmEmail, clearAuthMessage } from '../../actions/authAction';

const VerifyEmail = () => {
  const [token, setToken] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector(state => state.auth);
  const email = localStorage.getItem('email');

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      M.toast({ html: 'No email found for verification', classes: 'red' });
      navigate('/register');
    }
  }, [email, navigate]);

  // Show error messages
  useEffect(() => {
    if (error) {
      M.toast({ html: error, classes: 'red' });
    }
    if (message) {
      M.toast({ html: message, classes: 'green' });
      dispatch(clearAuthMessage()); // <--- ADD THIS LINE
    }
  }, [error, message, dispatch]); // Add dispatch to dependency array

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!token.trim()) {
      M.toast({ html: 'Please enter the verification code', classes: 'red' });
      return;
    }

    try {
      const result = await dispatch(confirmEmail(token)); // Pass token directly
      
      if (result.success) {
          setTimeout(() => navigate('/login'), 1500);
     }
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ maxWidth: '500px', marginTop: '60px' }}
    >
      <div className="card z-depth-3">
        <div className="card-content">
          <motion.h4 className="center-align">
            Verify Your Email
          </motion.h4>
          
          {email && (
            <p className="center-align grey-text">
              A verification code has been sent to <strong>{email}</strong>
            </p>
          )}

          <form onSubmit={onSubmit} style={{ marginTop: '30px' }}>
            <div className="input-field">
              <input
                type="text"
                id="verification"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="validate"
                disabled={loading}
              />
              <label htmlFor="verification">Verification Code</label>
            </div>

            <motion.button
              type="submit"
              className="btn waves-effect waves-light blue darken-2"
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              style={{ width: '100%', marginTop: '20px' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <PreLoader/>
                </>
              ) : (
                'Verify Email'
              )}
            </motion.button>
          </form>

          <div className="center" style={{ marginTop: '20px' }}>
            <button 
              className="btn-flat"
              onClick={() => {
                localStorage.removeItem('email');
                navigate('/register');
              }}
            >
              Use different email
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VerifyEmail;