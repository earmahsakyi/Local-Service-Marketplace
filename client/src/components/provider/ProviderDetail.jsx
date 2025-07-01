import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProviderById, clearErrors } from '../../actions/providerAction';
import {  getServicesByProviderId } from '../../actions/serviceActions';

// Lucide icons
import {
  MapPin,
  Phone,
  BadgeCheck,
  BadgeX,
  User2,
  Info,
  ArrowLeft,
  Stars,
  Briefcase,
  Wrench,
  Plug,
  Droplets,
  Hammer,
  Car,
  ClipboardList,
  CalendarClock,
  Tag,
} from "lucide-react";

// Service icon helpers
const SERVICE_ICONS = {
  Electrician: Plug,
  Plumber: Droplets,
  Cleaner: Wrench,
  Carpenter: Hammer,
  Mechanic: Car,
};

const getServiceIcon = (service) => {
  const Icon = SERVICE_ICONS[service];
  return Icon ? <Icon className="w-4 h-4 text-blue-600" /> : <BadgeCheck className="w-4 h-4 text-blue-600" />;
};

const ProviderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { provider, loading, error } = useSelector((state) => state.provider);
  const { provider_services } = useSelector(state => state.service);
  

  useEffect(() => {
    dispatch(clearErrors());
    dispatch(getProviderById(id));
    dispatch( getServicesByProviderId(id));
  }, [dispatch, id]);

  const API_BASE_URL = 'http://localhost:5000';

  if (loading || !provider) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-gray-500 text-lg">
        <Stars className="animate-spin mr-2 w-6 h-6 text-blue-500" /> Loading provider details...
      </div>
    );
  }

  const { fullName, title, services, description, phone, location, photo } = provider;
  console.log("provider extraservices",provider_services)
  return (
    <Fragment>
      <div className="max-w-4xl mx-auto pt-6">
        <Link
          to="/customer-page"
          className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back To Dashboard
        </Link>
      </div>
      <div className="max-w-4xl mx-auto px-4">
        {error && (
          <div className="text-red-500 mb-4" role="alert">
            {error}
          </div>
        )}

        <motion.div
          className="rounded-2xl shadow-lg bg-white dark:bg-zinc-900/90 flex flex-col md:flex-row gap-8 p-8 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left/Top: Avatar and basic info */}
          <div className="flex flex-col items-center md:w-1/3 w-full">
            <div className="relative mb-4">
              <img
                src={photo
                  ? `${API_BASE_URL}/uploads/providers/${photo?.split(/[\\/]/).pop()}`
                  : undefined}
                alt={`${fullName || 'Provider'}'s avatar`}
                className="rounded-full border-4 border-blue-200 shadow-lg object-cover bg-gray-200"
                style={{ width: '130px', height: '130px' }}
              />
              <span className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                <User2 className="w-5 h-5 text-white" />
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-blue-700 mb-1 text-center">{fullName || 'Unnamed Provider'}</h1>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600 text-base">{title || 'No title provided'}</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              {(services || []).map((service, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-lg text-xs"
                >
                  {getServiceIcon(service)}
                  {service}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
              <MapPin className="w-4 h-4" />
              {[location?.city, location?.region, location?.town].filter(Boolean).join(', ') || 'No location provided'}
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Phone className="w-4 h-4" />
              <span>{phone || 'No phone number provided'}</span>
            </div>
          </div>
          {/* Right/Bottom: Description & Details */}
          <div className="md:w-2/3 w-full">
            <div className="mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-semibold text-blue-800">Provider Details</h3>
            </div>
            <div className="mb-4">
              {description ? (
                <p className="text-gray-700 dark:text-zinc-200">{description}</p>
              ) : (
                <p className="text-gray-400 italic">No description provided.</p>
              )}
            </div>
            <ul className="text-gray-700 dark:text-zinc-200 space-y-2 text-base">
              <li>
                <span className="font-bold mr-2">Title:</span>
                {title || 'No title provided'}
              </li>
              <li>
                <span className="font-bold mr-2">Services:</span>
                {(services && services.length > 0) ? services.join(', ') : 'No services listed'}
              </li>
              <li>
                <span className="font-bold mr-2">Phone:</span>
                {phone || 'No phone number provided'}
              </li>
              <li>
                <span className="font-bold mr-2">Location:</span>
                {[location?.city, location?.region, location?.town].filter(Boolean).join(', ') || 'No location provided'}
              </li>
            </ul>

            {/* Provider's additional services section */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-blue-700 text-lg">Related Services</span>
              </div>
              {provider_services && provider_services.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {provider_services.map((s, idx) => (
                    <div
                      key={s._id || idx}
                      className={`flex flex-col gap-2 p-4 rounded-xl shadow transition border
                        ${s.isActive ? 'bg-blue-50 dark:bg-zinc-800 border-blue-200' : 'bg-zinc-100 dark:bg-zinc-950 border-gray-400 opacity-70'}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        {getServiceIcon(s.name)}
                        <span className="font-bold text-blue-800 dark:text-blue-200">{s.name}</span>
                        {s.category && (
                          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium rounded px-2 py-0.5 ml-2">
                            <Tag className="w-3 h-3" /> {s.category}
                          </span>
                        )}
                        {s.isActive ? (
                          <span className="ml-auto flex items-center gap-1 text-green-600 text-xs">
                            <BadgeCheck className="w-4 h-4" /> Active
                          </span>
                        ) : (
                          <span className="ml-auto flex items-center gap-1 text-gray-400 text-xs">
                            <BadgeX className="w-4 h-4" /> Inactive
                          </span>
                        )}
                      </div>
                      <div className="text-gray-700 dark:text-zinc-100 text-sm">{s.description || <span className="italic text-gray-400">No description</span>}</div>
                      <div className="flex items-center gap-2 mt-1 text-blue-700 dark:text-blue-200 font-bold">
                        <span>Price:</span>
                        <span className="px-2 py-0.5 bg-blue-200/60 dark:bg-blue-900/50 rounded text-sm">{s.price}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <CalendarClock className="w-3 h-3" />
                        <span title={`Created: ${new Date(s.createdAt).toLocaleString()}\nUpdated: ${new Date(s.updatedAt).toLocaleString()}`}>
                          {s.createdAt ? `Since ${new Date(s.createdAt).toLocaleDateString()}` : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 italic">No additional services found for this provider.</div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </Fragment>
  );
};

export default ProviderDetail;