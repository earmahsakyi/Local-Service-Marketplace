import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import M from 'materialize-css';
import { loadUser } from '../../actions/authAction';
import { updateProviderProfile, getCurrentProviderProfile, clearErrors } from '../../actions/providerAction';

const EditProfileModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector(state => state.provider);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    description: '',
    phone: '',
    services: '',
    town: '',
    city: '',
    region: '',
    photo: null
  });

  const [fileName, setFileName] = useState('');

  // Fetch profile if not available and modal is opening
  useEffect(() => {
    if (!profile && isOpen && !isFetchingProfile) {
      console.log('Fetching profile in EditProfileModal');
      setIsFetchingProfile(true);
      dispatch(getCurrentProviderProfile()).finally(() => {
        setIsFetchingProfile(false);
      });
    }
  }, [isOpen, profile, dispatch, isFetchingProfile]);

  // Pre-fill form data when profile is available
  useEffect(() => {
    if (profile && isOpen) {
      console.log('Setting form data for edit:', profile);
      setFormData({
        fullName: profile.fullName || '',
        title: profile.title || '',
        description: profile.description || '',
        phone: profile.phone || '',
        services: profile.services?.join(', ') || '',
        town: profile.location?.town || '',
        city: profile.location?.city || '',
        region: profile.location?.region || '',
        photo: null
      });
      setFileName('');
    }
  }, [profile, isOpen]);

  // Clear errors when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(clearErrors());
    }
  }, [isOpen, dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    if (files) {
      setFileName(files[0] ? files[0].name : '');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      title: '',
      description: '',
      phone: '',
      services: '',
      town: '',
      city: '',
      region: '',
      photo: null
    });
    setFileName('');
  };

  const handleClose = () => {
    if (!isSubmitting && !loading) {
      resetForm();
      dispatch(clearErrors());
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting || loading) {
      return;
    }

    if (!formData.fullName.trim()) {
      M.toast({ html: 'Full name is required', classes: 'red' });
      return;
    }
    
    if (formData.phone && !/^\+?\d{7,15}$/.test(formData.phone)) {
      M.toast({ html: 'Invalid phone number format', classes: 'red' });
      return;
    }
    
    if (formData.photo && !['image/jpeg', 'image/png', 'image/gif'].includes(formData.photo.type)) {
      M.toast({ html: 'Invalid photo format (use JPEG, PNG, or GIF)', classes: 'red' });
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('fullName', formData.fullName.trim());
    formDataToSend.append('title', formData.title?.trim() || '');
    formDataToSend.append('description', formData.description?.trim() || '');
    formDataToSend.append('phone', formData.phone?.trim() || '');
    
    // Send services as array
    if (formData.services?.trim()) {
      const servicesArray = formData.services.split(',').map(s => s.trim()).filter(Boolean);
      formDataToSend.append('services', JSON.stringify(servicesArray));
    }
    
    formDataToSend.append('location', JSON.stringify({
      town: formData.town?.trim() || '',
      city: formData.city?.trim() || '',
      region: formData.region?.trim() || ''
    }));
    
    if (formData.photo) {
      formDataToSend.append('photo', formData.photo);
    }
    
    // Only append user if explicitly required
    if (profile?.user?._id) {
      formDataToSend.append('user', profile.user._id);
    }

    console.log('Submitting form data:');
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    try {
      await dispatch(updateProviderProfile(formDataToSend));
      M.toast({ html: 'Profile updated successfully!', classes: 'green' });
      
      // Refresh profile data - but don't await to avoid blocking
      dispatch(getCurrentProviderProfile());
      dispatch(loadUser());
      
      // Close modal immediately after successful update
      resetForm();
      setIsSubmitting(false);
      onClose();
      
    } catch (err) {
      setIsSubmitting(false);
      const errorMessage = err.response?.data?.msg || err.message || 'Failed to update profile';
      console.error('Error updating profile:', {
        message: errorMessage,
        status: err.response?.status,
        data: err.response?.data
      });
      M.toast({ html: errorMessage, classes: 'red' });
    }
  };

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold">Edit Profile</h4>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
              disabled={isSubmitting || loading}
            >
              ×
            </button>
          </div>
          
          {isFetchingProfile && (
            <p className="text-gray-500 mb-4">Loading profile data...</p>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter full name"
                required
                disabled={loading || isFetchingProfile || isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter professional title"
                disabled={loading || isFetchingProfile || isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe yourself"
                rows="3"
                disabled={loading || isFetchingProfile || isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
                disabled={loading || isFetchingProfile || isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="services" className="block text-sm font-medium text-gray-700 mb-1">
                Services (comma-separated)
              </label>
              <input
                type="text"
                name="services"
                value={formData.services}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter services (e.g., Plumbing, Cleaning)"
                disabled={loading || isFetchingProfile || isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="town" className="block text-sm font-medium text-gray-700 mb-1">
                Town
              </label>
              <input
                type="text"
                name="town"
                value={formData.town}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter town"
                disabled={loading || isFetchingProfile || isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter city"
                disabled={loading || isFetchingProfile || isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter region"
                disabled={loading || isFetchingProfile || isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Photo
              </label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={loading || isFetchingProfile || isSubmitting}
              />
              {fileName && <p className="text-sm text-gray-500 mt-1">Selected: {fileName}</p>}
            </div>
            
            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting || loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading || isFetchingProfile}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              >
                {isSubmitting || loading ? 'Saving...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;