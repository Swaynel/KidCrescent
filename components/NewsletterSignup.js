"use client";
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'newsletterSubscribers'), {
        email,
        subscribedAt: Timestamp.now(),
        active: true,
        preferences: { newReleases: true, events: true, news: true }
      });
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_NEWSLETTER,
        { email },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError('Failed to subscribe. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">Subscribe to Newsletter</h3>
      <form onSubmit={handleSubmit} className="flex">
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Your email" 
          className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-l text-white" 
          required 
        />
        <button type="submit" disabled={loading} className="bg-white text-black p-2 rounded-r">
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {success && <p className="mt-2 text-green-400">Subscribed successfully!</p>}
      {error && <p className="mt-2 text-red-400">{error}</p>}
    </div>
  );
};

export default NewsletterSignup;