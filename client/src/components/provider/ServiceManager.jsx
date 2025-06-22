import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import M from 'materialize-css';
import { PlusCircle, Edit, Trash2, PackageSearch, Wrench } from 'lucide-react';
import { getProviderServices, deleteProviderService, clearServiceError } from '../../actions/serviceActions';
import ServiceFormModal from './ServiceFormModal';

const ServiceManager = () => {
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector(state => state.service);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const modalInitialized = useRef(false);
  const deleteModalRef = useRef(null);

  useEffect(() => {
    if (!modalInitialized.current) {
      M.AutoInit();
      modalInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    dispatch(getProviderServices());
  }, [dispatch]);

  useEffect(() => {
    console.log('Services updated:', services);
    if (services.some(service => !service._id)) {
      console.warn('Invalid service detected:', services);
    }
  }, [services]);

  const handleAddServiceClick = () => {
    setServiceToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service) => {
    console.log('Editing service:', service);
    setServiceToEdit(service);
    setIsModalOpen(true);
  };

  const handleDeleteService = (service) => {
    setServiceToDelete(service);
    const modal = document.querySelector('#delete-confirm-modal');
    if (modal) {
      const instance = M.Modal.getInstance(modal) || M.Modal.init(modal);
      instance.open();
    }
  };

  const confirmDelete = async () => {
    if (!serviceToDelete?._id) return;
    
    try {
      await dispatch(deleteProviderService(serviceToDelete._id));
      M.toast({ html: 'Service deleted successfully!', classes: 'green' });
    } catch (err) {
      M.toast({ html: error || 'Failed to delete service', classes: 'red' });
    }
    
    const modal = document.querySelector('#delete-confirm-modal');
    if (modal) {
      const instance = M.Modal.getInstance(modal);
      if (instance) instance.close();
    }
    setServiceToDelete(null);
  };

  const handleModalClose = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
    setServiceToEdit(null);
    dispatch(clearServiceError());
  };

  // Handle errors that occur outside of modal context
  useEffect(() => {
    if (error && !isModalOpen && !loading) {
      M.toast({ html: error, classes: 'red' });
      dispatch(clearServiceError());
    }
  }, [error, isModalOpen, loading, dispatch]);

  if (error && !loading && !isModalOpen) {
    return (
      <div className="text-center p-6 text-red-500">
        <p>Error loading services: {error}</p>
        <button 
          onClick={() => dispatch(getProviderServices())}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 w-full max-w-2xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">Your Services</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
          onClick={handleAddServiceClick}
          disabled={loading}
        >
          <PlusCircle size={20} className="mr-2" />
          <span>Add Service</span>
        </motion.button>
      </div>

      {loading && (
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading services...</p>
        </div>
      )}

      {!loading && services.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="text-gray-400 mb-4 flex justify-center">
            <PackageSearch size={48} />
          </div>
          <p className="text-gray-500 text-lg">No services added yet.</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Service" to get started.</p>
        </motion.div>
      )}

      {!loading && services.length > 0 && (
        <ul className="space-y-3">
          {services
            .filter(service => service._id) // Only render services with _id
            .map((service, index) => (
              <motion.li
                key={service._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center space-x-4 w-full">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg">
                    <Wrench size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">{service.name || 'Unnamed Service'}</span>
                    <p className="block text-sm text-gray-500 mt-1">
                      {typeof service.price === 'number' ? `${service.price} GHS` : service.price || 'No Price'}
                      {service.category && ` | ${service.category}`}
                    </p>
                    {service.description && (
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{service.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 mt-3 sm:mt-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                    aria-label="Edit Service"
                    onClick={() => handleEditService(service)}
                    disabled={loading}
                  >
                    <Edit size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                    aria-label="Delete Service"
                    onClick={() => handleDeleteService(service)}
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </motion.li>
            ))}
        </ul>
      )}

      {/* Service Form Modal */}
      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        serviceToEdit={serviceToEdit}
      />

      {/* Delete Confirmation Modal */}
      <div ref={deleteModalRef} id="delete-confirm-modal" className="modal">
        <div className="modal-content">
          <h4 className="text-lg font-bold mb-4">Confirm Delete</h4>
          <p>Are you sure you want to delete the service "{serviceToDelete?.name || 'Unnamed Service'}"? This action cannot be undone.</p>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close btn-flat mr-2 text-gray-600 hover:text-gray-800"
            onClick={() => {
              setServiceToDelete(null);
              const modal = document.querySelector('#delete-confirm-modal');
              if (modal) {
                const instance = M.Modal.getInstance(modal);
                if (instance) instance.close();
              }
            }}
          >
            Cancel
          </button>
          <button
            className="btn bg-red-600 hover:bg-red-700 text-white rounded-md px-4 "
            onClick={confirmDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceManager;