import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentProviderProfile } from '../../actions/providerAction';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faClipboardList, faStar } from '@fortawesome/free-solid-svg-icons';

const WelcomeMessage = () => {
  const { profile, loading, error, stats } = useSelector(state => state.provider);
  const dispatch = useDispatch();
  const API_BASE_URL = 'http://localhost:5000'; // Should be from env var

  useEffect(() => {
    dispatch(getCurrentProviderProfile());
    // If you fetch stats separately, dispatch for stats too
  }, [dispatch]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white rounded-xl shadow animate-pulse"
      >
        Loading your profile...
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-red-100 rounded-xl text-red-700 shadow"
      >
        Sorry, we couldn't load your profile.<br />
        <span className="text-sm">Error: {error}</span>
      </motion.div>
    );
  }

  if (!profile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-yellow-50 rounded-xl text-yellow-600 shadow"
      >
        No profile found.
      </motion.div>
    );
  }

  // You can get these stats from your Redux store or API
  const quickStats = [
    {
      icon: faBoxOpen,
      label: 'Services',
      value: stats?.services || 0,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      icon: faClipboardList,
      label: 'Requests',
      value: stats?.requests || 0,
      color: 'bg-green-100 text-green-700'
    },
    {
      icon: faStar,
      label: 'Reviews',
      value: stats?.reviews || 0,
      color: 'bg-yellow-100 text-yellow-700'
    }
  ];

  // Construct avatarSrc for the img tag within the return statement
let avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || "Provider")}`;
if (profile?.photo) {
  // Add 'providers' to the path
  avatarSrc = `${API_BASE_URL}/uploads/providers/${profile.photo.split(/[\\/]/).pop()}`;
  console.log('Updated image URL:', avatarSrc); // Verify the new URL
}
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-6"
    >
      {/* Profile Avatar */}
      <img
        src={avatarSrc} // Use the new imageSrc
        alt="Profile"
        className="w-24 h-24 rounded-full shadow border-4 border-blue-100 object-cover"
      />

      {/* Welcome and stats */}
      <div className="flex-1 flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, <span className="text-blue-700">{profile?.fullName || 'Provider'}</span>!
        </h2>
        <div className="text-gray-600 text-lg">
          We're glad to see you{profile?.title ? `, ${profile.title}` : ''}.
        </div>
        <div className="mt-4 flex gap-4">
          {quickStats.map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 ${s.color} shadow`}
            >
              <FontAwesomeIcon icon={s.icon} className="text-base" />
              <div>
                <div className="font-semibold text-lg">{s.value}</div>
                <div className="text-xs">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeMessage;