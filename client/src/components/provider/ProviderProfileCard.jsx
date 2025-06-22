import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Edit3Icon as EditIcon } from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import { getCurrentProviderProfile } from '../../actions/providerAction';

const ProviderProfileCard = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector(state => state.provider);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    console.log('Fetching provider profile in ProviderProfileCard');
    dispatch(getCurrentProviderProfile());
  }, [dispatch]);

  const handleEditClick = useCallback(() => {
    console.log('Edit profile clicked');
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    console.log('Closing edit profile modal');
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    console.log('isModalOpen changed:', isModalOpen);
  }, [isModalOpen]);

  if (loading && !profile) {
    return (
      <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-lg px-6 py-8 text-center">
        Loading profile card...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-lg px-6 py-8 text-center">
        Profile data not available.
      </div>
    );
  }

  let avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || "Provider")}`;
  if (profile?.photo) {
    avatarSrc = `${API_BASE_URL}/uploads/providers/${profile.photo.split(/[\\/]/).pop()}`;
  }

  const locationDisplay = [profile?.location?.town, profile?.location?.city, profile?.location?.region]
    .filter(Boolean)
    .join(', ') || 'Location not set';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-lg px-6 py-8 flex flex-col items-center space-y-3"
      >
        <img
          src={avatarSrc}
          alt={profile?.fullName || 'avatar'}
          onError={(e) => (e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || "Provider")}`)}
          className="w-24 h-24 rounded-full shadow-md border-4 border-white dark:border-zinc-800 object-cover mb-2"
        />

        <h3 className="text-xl font-bold">{profile?.fullName || 'N/A'}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{profile?.title || 'No title specified'}</p>

        <div className="w-full flex flex-col items-start mt-4 space-y-2 text-sm">
          <div className="flex items-center">
            <Phone size={16} className="w-4 mr-2 text-blue-500" />
            <span>{profile?.phone || 'No phone'}</span>
          </div>
          <div className="flex items-center">
            <MapPin size={16} className="w-4 mr-2 text-green-500" />
            <span>{locationDisplay}</span>
          </div>
        </div>

        <button
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          onClick={handleEditClick}
        >
          <EditIcon size={16} />
          Edit Profile
        </button>
      </motion.div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  );
};

export default ProviderProfileCard;