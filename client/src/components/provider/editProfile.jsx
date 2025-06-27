import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateProviderProfile } from '../../actions/providerAction'; // adjust path as needed
import { loadUser } from '../../actions/authAction';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    description: '',
    phone: '',
    services: '',
    city: '',
    region: '',
    town: '',
    photo: null
  });

  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, photo: file }));
    setFileName(file ? file.name : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('fullName', formData.fullName);
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('phone', formData.phone);
      payload.append('services', formData.services);
      payload.append(
        'location',
        JSON.stringify({
          city: formData.city,
          region: formData.region,
          town: formData.town
        })
      );
      if (formData.photo) {
        payload.append('photo', formData.photo);
      }

      await dispatch(updateProviderProfile(payload));

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your provider profile has been updated.',
        showConfirmButton: false,
        timer: 1500,
      });

      await dispatch(loadUser()); // <--- ADD THIS LINE

      setTimeout(() => {
        setLoading(false);
        setFileName('');
        navigate('/provider-page');
      }, 1200);
    } catch (err) {
      setLoading(false);
      Swal.fire('Error', err.message || 'Something went wrong', 'error');
    }
  };
  const cancel = () => {
    navigate('/provider-page')
  }

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ marginTop: 40, marginBottom: 40, maxWidth: 600 }}
    >
      <div className="card" style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
        <div className="card-content">
          <h5 className="center-align" style={{ fontWeight: 600, color: '#1565c0', marginBottom: 32 }}>
            Provider Profile
          </h5>
          <form onSubmit={handleSubmit} className="row" autoComplete="off" encType="multipart/form-data">
            <div className="input-field col s12 m6">
              <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} required disabled={loading} />
              <label htmlFor="fullName" className={formData.fullName ? "active" : ""}>Full Name</label>
            </div>
            <div className="input-field col s12 m6">
              <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} required disabled={loading} />
              <label htmlFor="title" className={formData.title ? "active" : ""}>Title</label>
            </div>
            <div className="input-field col s12">
              <textarea
                id="description"
                name="description"
                className="materialize-textarea"
                value={formData.description}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <label htmlFor="description" className={formData.description ? "active" : ""}>Description</label>
            </div>
            <div className="input-field col s12 m6">
              <input id="phone" name="phone" type="text" value={formData.phone} onChange={handleChange} required disabled={loading} />
              <label htmlFor="phone" className={formData.phone ? "active" : ""}>Phone</label>
            </div>
            <div className="input-field col s12 m6">
              <input id="services" name="services" type="text" value={formData.services} onChange={handleChange} required disabled={loading} />
              <label htmlFor="services" className={formData.services ? "active" : ""}>Services (comma-separated)</label>
            </div>
            <div className="input-field col s12 m4">
              <input id="city" name="city" type="text" value={formData.city} onChange={handleChange} disabled={loading} />
              <label htmlFor="city" className={formData.city ? "active" : ""}>City</label>
            </div>
            <div className="input-field col s12 m4">
              <input id="region" name="region" type="text" value={formData.region} onChange={handleChange} disabled={loading} />
              <label htmlFor="region" className={formData.region ? "active" : ""}>Region</label>
            </div>
            <div className="input-field col s12 m4">
              <input id="town" name="town" type="text" value={formData.town} onChange={handleChange} disabled={loading} />
              <label htmlFor="town" className={formData.town ? "active" : ""}>Town</label>
            </div>
            <div className="file-field input-field col s12">
              <div className="btn blue" style={{ borderRadius: 8 }}>
                <span>Upload Photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={loading} />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" placeholder="Upload a profile photo" value={fileName} readOnly />
              </div>
            </div>
            <div className="col s12 center-align" style={{ marginTop: 24 }}>
              <button
                type="submit"
                className="btn waves-effect waves-light green"
                disabled={loading}
                style={{ minWidth: 180, borderRadius: 8, fontWeight: 600, fontSize: 18 }}
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
              <button className="btn bg-red-600 hover:bg-red-700 text-white rounded-md px-4 ml-3" onClick={cancel}>
              Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default UpdateProfile;
