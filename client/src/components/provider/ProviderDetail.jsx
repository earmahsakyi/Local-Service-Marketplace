import React, { useEffect, Fragment } from 'react';
   import { useDispatch, useSelector } from 'react-redux';
   import { useParams, Link } from 'react-router-dom';
   import { motion } from 'framer-motion';
   import { getProviderById, clearErrors } from '../../actions/providerAction';

   const ProviderDetail = () => {
     const { id } = useParams();
     const dispatch = useDispatch();
     const { provider, loading, error } = useSelector((state) => state.provider);

     useEffect(() => {
       dispatch(clearErrors());
       dispatch(getProviderById(id));
     }, [dispatch, id]);

     const API_BASE_URL = 'http://localhost:5000';

     if (loading || !provider) {
       return <div className="text-gray-500">Loading provider details...</div>;
     }

     const { fullName, title, services, description, phone, location, photo } = provider;

     return (
       <Fragment>
         <Link to="/customer-page" className="btn btn-light mb-4">Back To Dashboard</Link>
         <div className="max-w-4xl mx-auto p-4">
           {error && (
             <div className="text-red-500 mb-4" role="alert">{error}</div>
           )}
           <motion.div
             className="card grid-2"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
           >
             <div className="all-center">
               <img
                 src={photo ? `${API_BASE_URL}/${photo}` : 'https://via.placeholder.com/150'}
                 alt={`${fullName || 'Provider'}'s avatar`}
                 className="round-img"
                 style={{ width: '150px' }}
               />
               <h1>{fullName || 'Unnamed Provider'}</h1>
               <p>Location: {[location?.city, location?.region, location?.town].filter(Boolean).join(', ') || 'No location provided'}</p>
             </div>
             <div>
               {description && (
                 <Fragment>
                   <h3>Description</h3>
                   <p>{description}</p>
                 </Fragment>
               )}
               <ul>
                 <li><strong>Title:</strong> {title || 'No title provided'}</li>
                 <li><strong>Services:</strong> {services?.join(', ') || 'No services listed'}</li>
                 <li><strong>Phone:</strong> {phone || 'No phone number provided'}</li>
               </ul>
             </div>
           </motion.div>
           {/* Add more sections (e.g., stats, activity) if needed */}
         </div>
       </Fragment>
     );
   };

   export default ProviderDetail;