import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import M from 'materialize-css/dist/js/materialize.min.js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PreLoader from '../layouts/PreLoader';
import { forgotPassword } from '../../actions/authAction';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector(state => state.auth);


  // Show error messages
  useEffect(() => {
    if (error) {
      M.toast({ html: error, classes: 'red' });
    }
    if (message) {
      M.toast({ html: message, classes: 'green' });
    }
  }, [error, message]);

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if(email === ''){
        M.toast({ html:"Enter an email", classes: 'red' })
    }

    try {
      const result = await dispatch(forgotPassword(email)); 
      
      if (result.success) {
          setTimeout(() => navigate('/reset-password'), 1500);
     }
    } catch (err) {
      console.error("Server error", err);
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
            Password reset
          </motion.h4>
          
          {email && (
            <p className="center-align grey-text">
               Enter your email for password reset 
            </p>
          )}

          <form onSubmit={onSubmit} style={{ marginTop: '30px' }}>
            <div className="input-field">
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="validate"
                disabled={loading}
              />
              <label htmlFor="email">Email</label>
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
                'Send Code'
              )}
            </motion.button>
          </form>

          <div className="center" style={{ marginTop: '20px' }}>
            <button 
              className="btn-flat"
              onClick={() => {
               
                navigate('/login');
              }}
            >
              I rememeber now,Login
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;