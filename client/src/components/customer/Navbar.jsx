import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ListChecks, LogOut,UserCog } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentCustomerProfile, clearCustomerProfile } from '../../actions/customerAction';
import { logout } from '../../actions/authAction';

// Utility function to get initials from name
const getInitials = (name) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return 'NA'; // Fallback for no name
  }

  const nameParts = name.trim().split(/\s+/); // Split on whitespace
  if (nameParts.length === 1) {
    // Single word, take first two letters
    return nameParts[0].slice(0, 2).toUpperCase();
  }
  // Multiple words, take first letter of first two words
  return (nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : '')).toUpperCase();
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.customer || {});


  // Fetch customer profile on mount
  useEffect(() => {
    dispatch(getCurrentCustomerProfile());
  }, [dispatch]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClick(e) {
      if (open && ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(clearCustomerProfile());
    dispatch(logout());
    setOpen(false);
    navigate('/login');
  };

  // Use profile.fullName or fallback to user.name or 'John Doe'
  const displayName = profile?.fullName;
  const initials = getInitials(displayName);

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 shadow-md">
      <h5 className="text-2xl font-bold text-white">Dashboard</h5>
      <div className="relative" ref={ref}>
        <button
          className="flex items-center space-x-2 bg-white rounded-full p-2 hover:bg-gray-200 transition duration-150"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle user menu"
        >
          <div
            className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm"
            aria-label={`User initials: ${initials}`}
          >
            {loading ? '...' : initials}
          </div>
          <span className="text-gray-800 font-medium">
            {loading ? 'Loading...' : displayName}
          </span>
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <Link
              to="/tasks"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              <UserCog size={18} className="mr-2" />
              Edit Profile
            </Link>
            <Link
              to="/bookings"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              <ListChecks size={18} className="mr-2" />
              Bookings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;