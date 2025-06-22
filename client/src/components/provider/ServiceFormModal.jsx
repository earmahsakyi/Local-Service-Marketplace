import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import M from 'materialize-css';
import { addProviderService, updateProviderService, clearServiceError, } from '../../actions/serviceActions';

const ServiceFormModal = ({ isOpen, onClose, serviceToEdit = null }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.service);
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  // Handle form data when editing
  useEffect(() => {
    if (serviceToEdit) {
      console.log('Setting form data for edit:', serviceToEdit);
      setFormData({
        name: serviceToEdit.name || '',
        description: serviceToEdit.description || '',
        price: serviceToEdit.price ? String(serviceToEdit.price).replace(/[^0-9.]/g, '') : '',
        category: serviceToEdit.category || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: ''
      });
    }
  }, [serviceToEdit]);

  // Initialize modal once
  useEffect(() => {
    if (modalRef.current && !modalInstanceRef.current) {
      modalInstanceRef.current = M.Modal.init(modalRef.current, {
        dismissible: true,
        onCloseEnd: () => {
          console.log('Modal closed via Materialize');
          handleModalClose();
        }
      });
    }

    return () => {
      if (modalInstanceRef.current) {
        modalInstanceRef.current.destroy();
        modalInstanceRef.current = null;
      }
    };
  }, []);

  // Handle modal open/close based on isOpen prop
  useEffect(() => {
    if (modalInstanceRef.current) {
      if (isOpen) {
        modalInstanceRef.current.open();
      } else {
        modalInstanceRef.current.close();
      }
    }
  }, [isOpen]);

  const handleModalClose = () => {
    if (!loading) { // Prevent closing while loading
      dispatch(clearServiceError());
      setFormData({
        name: '',
        description: '',
        price: '',
        category: ''
      });
      onClose();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      M.toast({ html: 'Name and price are required', classes: 'red' });
      return;
    }

    const submitData = {
      ...formData,
      price: formData.price ? `${parseFloat(formData.price).toFixed(2)} GHS` : ''
    };

    console.log('Submitting form data:', submitData);

    try {
      if (serviceToEdit) {
        await dispatch(updateProviderService(serviceToEdit._id, submitData));
        M.toast({ html: 'Service updated successfully!', classes: 'green' });
      } else {
        await dispatch(addProviderService(submitData));
        M.toast({ html: 'Service added successfully!', classes: 'green' });
      }
      
      // Close modal after successful submission
      if (modalInstanceRef.current) {
        modalInstanceRef.current.close();
      }
    } catch (err) {
      console.error('Error adding/updating service:', err);
      M.toast({ html: error || 'Failed to save service', classes: 'red' });
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    if (modalInstanceRef.current) {
      modalInstanceRef.current.close();
    }
  };

  return (
    <div ref={modalRef} id="service-form-modal" className="modal">
      <div className="modal-content">
        <h4 className="text-lg font-bold mb-4">
          {serviceToEdit ? 'Edit Service' : 'Add New Service'}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Service Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter service name"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the service"
              rows="4"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (GHS)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter price"
              min="0"
              step="0.01"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category (Optional)
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter category (e.g., Plumbing, Cleaning)"
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
          <div className="modal-footer">
            <button
              type="button"
              className="modal-close btn-flat mr-2 text-gray-600 hover:text-gray-800"
              onClick={handleCancelClick}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`btn ${loading ? 'disabled' : ''} bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 `}
            >
              {loading ? 'Saving...' : (serviceToEdit ? 'Update Service' : 'Add Service')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceFormModal;