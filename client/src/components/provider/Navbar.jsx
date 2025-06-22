import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, UserCog, ListChecks, WrenchIcon as ToolsIcon, LogOut } from 'lucide-react';
import { logout } from '../../actions/authAction';
import './Navbar.css'; 

const Navbar = ({ title }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        {/* Brand */}
        <Link className="navbar-brand" to="/provider-page">
          <LayoutDashboard size={20} className="brand-icon" />
          {title || 'Dashboard'}
        </Link>

        {/* Toggle for mobile */}
        <input type="checkbox" id="navbar-toggle" className="navbar-toggle" />
        <label htmlFor="navbar-toggle" className="navbar-toggle-label">
          <span className="navbar-toggle-icon"></span>
        </label>

        {/* Navbar Links */}
        <div className="navbar-links">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/complete-provider-profile">
                <UserCog size={18} className="nav-icon" />
                <span>Edit Profile</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/provider/bookings">
                <ListChecks size={18} className="nav-icon" />
                <span>My Bookings</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/provider/services">
                <ToolsIcon size={18} className="nav-icon" />
                <span>Services</span>
              </Link>
            </li>
          </ul>

          {/* Right side - User & Logout */}
          <ul className="navbar-actions">
            {user && (
              <li className="user-greeting">
                Hello, <span className="user-email">{user.email}</span>
              </li>
            )}
            <li className="nav-item">
              <button onClick={onLogout} className="logout-btn">
                <LogOut size={18} className="logout-icon" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;