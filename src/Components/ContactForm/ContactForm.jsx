import React, { useState } from 'react';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    subject: '',
    message: ''
  });

  // ⭐ NEW: State for loading and feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user types
    if (error) setError('');
    if (success) setSuccess('');
  };

  // ⭐ NEW: Backend connection function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Optional: Get token if user is logged in
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // 🔗 CONNECTION POINT: Send POST request to Flask backend
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Success
        setSuccess(data.message || 'Your message has been sent successfully!');
        
        // Clear form after successful submission
        setFormData({
          name: '',
          email: '',
          location: '',
          subject: '',
          message: ''
        });

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      } else {
        // ❌ Error from backend
        setError(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      // ❌ Network or other error
      console.error('Contact form error:', err);
      setError('Unable to connect to server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-container">
      <div className="contact-form-wrapper">
        <h1 className="contact-title font1">CONTACT US</h1>

        {/* ⭐ NEW: Success Message */}
        {success && (
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: '8px',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        {/* ⭐ NEW: Error Message */}
        {error && (
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: '#f44336',
            color: 'white',
            borderRadius: '8px',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">NAME*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jane Smith"
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">EMAIL*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@gmail.com"
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">LOCATION*</label>
            <div className="select-wrapper">
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-select"
                required
                disabled={loading}
              >
                <option value="">Select...</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
              </select>
              <div className="select-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subject" className="form-label">Subject *</label>
            <div className="select-wrapper">
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-select"
                required
                disabled={loading}
              >
                <option value="">Select a subject</option>
                <option value="product-inquiry">Product Inquiry</option>
                <option value="order-support">Order Support</option>
                <option value="bulk-order">Bulk Order</option>
                <option value="partnership">Partnership</option>
                <option value="b2b-inquiry">B2B Inquiry</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
              <div className="select-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">MESSAGE</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Hello!"
              rows="5"
              className="form-textarea"
              disabled={loading}
            />
          </div>

          {/* ⭐ UPDATED: Submit button with loading state */}
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
            style={{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Sending...' : 'Subscribe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;