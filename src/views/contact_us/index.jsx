import React, { useState } from 'react';
import { displayActionMessage } from '@/helpers/utils';
import { db } from '@/services/firebase';
import { MessageDisplay } from '@/components/common';
import { useDocumentTitle, useFeaturedProducts, useScrollTop } from '@/hooks';

const ContactUs = () => {
  useDocumentTitle('Contact Us | Baby-yards');
  useScrollTop();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await db.collection('queries').add(formData);
      displayActionMessage('Your query has been submitted.');
    } catch (err) {
      console.error(err);
      displayActionMessage('An error occurred while submitting your query.');
    }
    setIsLoading(false);
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '100px'
  };

  const inputStyle = {
    margin: '10px 0',
    padding: '10px',
    width: '200px',
    marginTop: '10px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    background: '#4CAF50',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px'
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required style={inputStyle} />
      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={inputStyle} />
      <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} required style={inputStyle} />
      <button type="submit" style={buttonStyle} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
    </form>
  );
}

export default ContactUs;