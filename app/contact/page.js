import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'contactSubmissions'), {
        ...formData,
        status: 'new',
        submittedAt: Timestamp.now()
      });
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT,
        formData,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );
      setSuccess(true);
      setFormData({name: '', email: '', subject: '', message: ''});
    } catch (err) {
      setError('Failed to send message. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Subject</label>
          <input name="subject" value={formData.subject} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Message</label>
          <textarea name="message" value={formData.message} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" rows="6" required />
        </div>
        <button type="submit" disabled={loading} className="bg-white text-black px-4 py-2 rounded">
          {loading ? 'Sending...' : 'Send Message'}
        </button>
        {success && <p className="mt-4 text-green-400">Message sent successfully!</p>}
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </form>
    </div>
  );
}