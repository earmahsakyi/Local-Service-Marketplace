import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateCustomerProfile } from '../../actions/customerAction';
import { loadUser } from '../../actions/authAction';

const UpdateProfileCustomer = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    region: '',
    town: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('fullName', formData.fullName);
      payload.append('phone', formData.phone);
      payload.append(
        'location',
        JSON.stringify({
          city: formData.city,
          region: formData.region,
          town: formData.town,
        })
      );
      await dispatch(updateCustomerProfile(payload));

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated successfully',
        text: 'Your customer Profile has been updated ',
        showConfirmButton: false,
        timer: 1500,
      });
      await dispatch(loadUser());

      setTimeout(() => {
        setLoading(false);
        navigate('/customer-page');
      }, 1200);
    } catch (err) {
      setLoading(false);
      Swal.fire('Error', err.message || 'Something went wrong', 'error');
      navigate('/login')
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gray-50 px-2"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h5 className="text-center font-semibold text-blue-700 text-2xl mb-8">
          Customer Profile
        </h5>
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1 mb-4 sm:mb-0">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1 mb-4 sm:mb-0">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div className="flex-1 mb-4 sm:mb-0">
              <label
                htmlFor="region"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Region
              </label>
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="town"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Town
              </label>
              <input
                type="text"
                id="town"
                name="town"
                value={formData.town}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center mt-8 gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white rounded-md py-2 px-8 font-semibold text-lg transition duration-150"
              disabled={loading}
            >
              {loading ? 'Saving' : 'Save Profile'}
            </button>
            <button
              onClick={handleCancel}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-md py-2 px-8 font-semibold text-lg transition duration-150"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateProfileCustomer;