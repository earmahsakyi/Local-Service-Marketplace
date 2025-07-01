import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MdSearch } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { searchProviders, clearProviders, clearErrors } from '../../actions/providerAction';
import { setAlert } from '../../actions/alertAction';

// Lucide icons
import {
  MapPin,
  Wrench,
  Plug,
  Droplets,
  Hammer,
  Car,
  User2,
  Stars,
  LocateFixed,
  Info,
} from "lucide-react";

const SERVICES = [
  { label: 'Electrician', icon: Plug },
  { label: 'Plumber', icon: Droplets },
  { label: 'Cleaner', icon: Wrench },
  { label: 'Carpenter', icon: Hammer },
  { label: 'Mechanic', icon: Car },
];

const getServiceIcon = (service) => {
  const match = SERVICES.find(s => s.label.toLowerCase() === service?.toLowerCase());
  return match ? match.icon : User2;
};

const SearchComponent = () => {
  const dispatch = useDispatch();
  const { providers, loading, error } = useSelector((state) => state.provider);
  const { alert } = useSelector((state) => state.alert);

  const [form, setForm] = useState({
    services: '',
    city: '',
    region: '',
    town: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.services || !form.city || !form.region || !form.town) {
      dispatch(setAlert('Please all fields are required', 'danger'));
      return;
    }
    dispatch(clearErrors());
    const criteria = Object.fromEntries(
      Object.entries(form).filter(([_, value]) => value)
    );
    dispatch(searchProviders(criteria));
  };

  const handleClear = () => {
    dispatch(clearProviders());
    setForm({ services: '', city: '', region: '', town: '' });
  };

  const API_BASE_URL = 'http://localhost:5000';

  // Card variants for animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {alert && (
        <div className={`alert alert-${alert.type} mb-4`} role="alert">
          {alert.msg}
        </div>
      )}
      <motion.form
        className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row md:items-end gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
      >
        <div className="flex-1">
          <label htmlFor="service-select" className="block text-gray-700 font-medium mb-2">
            Service
          </label>
          <select
            id="service-select"
            name="services"
            value={form.services}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            aria-describedby="service-help"
          >
            <option value="">Choose service</option>
            {SERVICES.map((service) => (
              <option key={service.label} value={service.label}>
                {service.label}
              </option>
            ))}
          </select>
          <p id="service-help" className="sr-only">
            Select a service to find providers in your area.
          </p>
        </div>
        <div className="flex-1 space-y-2">
          <div className="font-semibold text-gray-600 mb-1">Location</div>
          <div className="flex gap-2">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="City"
              autoComplete="off"
              aria-label="City"
            />
            <input
              name="region"
              value={form.region}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Region"
              autoComplete="off"
              aria-label="Region"
            />
            <input
              name="town"
              value={form.town}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Town"
              autoComplete="off"
              aria-label="Town"
            />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 disabled:bg-blue-300"
          type="submit"
          disabled={loading}
        >
          <MdSearch />
          {loading ? 'Searching...' : 'Search'}
        </motion.button>
      </motion.form>
      {providers?.length > 0 && (
        <button
          className="btn btn-light btn-block mt-4"
          onClick={handleClear}
          aria-label="Clear search results"
        >
          Clear
        </button>
      )}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {error && (
          <div className="text-red-500 mb-4" role="alert">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh] text-gray-500 text-lg">
        <Stars className="animate-spin mr-2 w-6 h-6 text-blue-500" /> Loading provider details...
      </div>
        ) : providers?.length > 0 ? (
          providers.map((provider, idx) => {
            // Choose icon by first service, fallback to User2
            const ServiceIcon = getServiceIcon(provider.services?.[0]);
            return (
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                key={provider._id}
                className="relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition group"
              >
                <div className="absolute top-4 right-4">
                  <Info className="w-5 h-5 text-blue-300" title="Provider Info" />
                </div>
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-3 shadow">
                  <ServiceIcon className="w-8 h-8 text-blue-600" />
                </div>
                <img
                  src={
                    provider.photo
                      ? `${API_BASE_URL}/uploads/providers/${provider.photo.split(/[\\/]/).pop()}`
                      : undefined
                  }
                  alt={`${provider.fullName || 'Provider'}'s avatar`}
                  className="rounded-full mx-auto mb-2 border-2 border-blue-200 shadow"
                  style={{ width: '60px', height: '60px', objectFit: "cover", background: "#f3f4f6" }}
                />
                <h3 className="font-bold text-lg text-blue-700 mb-1">{provider.fullName || 'Unnamed Provider'}</h3>
                <div className="flex flex-wrap gap-2 justify-center mb-2">
                  {(provider.services || []).map((service, i) => {
                    const Icon = getServiceIcon(service);
                    return (
                      <span key={i} className="flex items-center gap-1 text-sm px-2 py-1 rounded bg-blue-50 text-blue-700 font-semibold">
                        <Icon className="w-4 h-4" />
                        {service}
                      </span>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  {[provider.location?.city, provider.location?.region, provider.location?.town]
                    .filter(Boolean)
                    .join(', ') || 'No location provided'}
                </div>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{provider.description || 'No description provided'}</p>
                <Link
                  to={`/provider/${provider._id}`}
                  className="mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
                  aria-label={`View more details for ${provider.fullName || 'provider'}`}
                >
                  <LocateFixed className="w-4 h-4" /> More
                </Link>
              </motion.div>
            );
          })
        ) : (
          <div className="text-gray-500 col-span-full">No providers found. Try broadening your search.</div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;