import React, { useState } from 'react';
   import { useDispatch, useSelector } from 'react-redux';
   import { motion } from 'framer-motion';
   import { MdSearch } from 'react-icons/md';
   import { Link } from 'react-router-dom';
   import { searchProviders, clearProviders, clearErrors } from '../../actions/providerAction';
   import { setAlert } from '../../actions/alertAction';

   const SERVICES = ['Electrician', 'Plumber', 'Cleaner', 'Carpenter', 'Mechanic'];

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
       if (!form.services) {
         dispatch(setAlert('Please select a service.', 'danger'));
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
                 <option key={service} value={service}>
                   {service}
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
         {providers?.data?.length > 0 && (
           <button
             className="btn btn-light btn-block mt-4"
             onClick={handleClear}
             aria-label="Clear search results"
           >
             Clear
           </button>
         )}
         <div className="mt-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridGap: '1rem' }}>
           {error && (
             <div className="text-red-500 mb-4" role="alert">
               {error}
             </div>
           )}
           {loading ? (
             <div className="text-gray-500">Loading providers...</div>
           ) : providers?.data?.length > 0 ? (
             providers.data.map((provider) => (
               <Link
                 key={provider._id}
                 to={`/provider/${provider._id}`}
                 className="block card text-center"
                 aria-label={`View details for ${provider.fullName || 'provider'}`}
               >
                 <motion.div
                   className="bg-white rounded-lg shadow p-4 hover:shadow-xl transition-shadow"
                   whileHover={{ scale: 1.03 }}
                 >
                   <img
                     src={provider.photo ? `${API_BASE_URL}/${provider.photo}` : 'https://via.placeholder.com/60'}
                     alt={`${provider.fullName || 'Provider'}'s avatar`}
                     className="round-img mx-auto mb-2"
                     style={{ width: '60px' }}
                   />
                   <h3 className="font-bold text-lg text-blue-700">{provider.fullName || 'Unnamed Provider'}</h3>
                   <p className="text-gray-700">{provider.services?.join(', ') || 'No services listed'}</p>
                   <p className="text-gray-500 text-sm mt-2 truncate">{provider.description || 'No description provided'}</p>
                   <p className="text-gray-500 text-sm mt-1">
                     {[provider.location?.city, provider.location?.region, provider.location?.town]
                       .filter(Boolean)
                       .join(', ') || 'No location provided'}
                   </p>
                   <div>
                     <Link
                       to={`/provider/${provider._id}`}
                       className="btn btn-dark btn-sm my-1"
                       aria-label={`View more details for ${provider.fullName || 'provider'}`}
                     >
                       More
                     </Link>
                   </div>
                 </motion.div>
               </Link>
             ))
           ) : (
             <div className="text-gray-500">No providers found. Try broadening your search.</div>
           )}
         </div>
       </div>
     );
   };

   export default SearchComponent;