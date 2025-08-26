import { useState } from 'react';
import { useUser } from '../lib/hooks/useUser';
import { usePlaylists } from '../lib/hooks/usePlaylists';
import { requestPushPermission } from '../lib/push';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { updateDoc, doc, arrayUnion, addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../lib/auth';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { userData, updateUser, loading: userLoading } = useUser();
  const { playlists } = usePlaylists();
  const [genres, setGenres] = useState(userData?.profile?.favoriteGenres || []);
  const [playlistName, setPlaylistName] = useState('');
  const [referralCode, setReferralCode] = useState(userData?.referralCode || '');
  const router = useRouter();

  if (authLoading || userLoading) return <div>Loading...</div>;
  if (!user) {
    router.push('/login');
    return null;
  }

  const handleUpdatePreferences = async () => {
    await updateUser({ 'profile.favoriteGenres': genres });
  };

  const handleCreatePlaylist = async () => {
    if (playlistName) {
      await addDoc(collection(db, 'playlists'), {
        userId: user.uid,
        name: playlistName,
        tracks: []
      });
      setPlaylistName('');
    }
  };

  const handleGenerateReferral = async () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    await updateUser({ referralCode: code });
    setReferralCode(code);
  };

  const handleSubscribe = async (tier) => {
    const response = await fetch('/api/stripe/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'subscription', tier })
    });
    const { id } = await response.json();
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: id });
  };

  const handleManageSubscription = async () => {
    const response = await fetch('/api/stripe/portal', {
      method: 'POST'
    });
    const { url } = await response.json();
    window.location.href = url;
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <p>Email: {userData.email}</p>
      <p>Display Name: {userData.displayName}</p>
      <p>Subscription Tier: {userData.subscriptionTier || 'free'}</p>
      <button onClick={() => handleSubscribe('premium')} className="bg-white text-black p-2 rounded">Subscribe to Premium</button>
      {userData.subscriptionTier !== 'free' && <button onClick={handleManageSubscription} className="bg-blue-600 text-white p-2 rounded ml-4">Manage Subscription</button>}
      <button onClick={() => requestPushPermission(user)} className="bg-green-600 text-white p-2 rounded ml-4">Enable Push Notifications</button>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Favorite Genres</h2>
        <input value={genres.join(',')} onChange={(e) => setGenres(e.target.value.split(','))} className="p-2 bg-gray-800 border rounded" />
        <button onClick={handleUpdatePreferences} className="bg-white text-black p-2 rounded ml-2">Save</button>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Playlists</h2>
        <input value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} placeholder="New Playlist Name" className="p-2 bg-gray-800 border rounded" />
        <button onClick={handleCreatePlaylist} className="bg-white text-black p-2 rounded ml-2">Create</button>
        <ul>
          {playlists.map(pl => <li key={pl.id}>{pl.name}</li>)}
        </ul>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Referral Code</h2>
        {referralCode ? <p>{referralCode}</p> : <button onClick={handleGenerateReferral} className="bg-white text-black p-2 rounded">Generate Code</button>}
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Purchased Digital Products</h2>
        <ul>
          {userData.purchasedProducts?.map(id => <li key={id}>Product {id} <a href={`/download/${id}`}>Download</a></li>) || 'None'}
        </ul>
      </div>
      <button onClick={handleLogout} className="bg-red-600 text-white p-2 rounded mt-4">Logout</button>
    </div>
  );
};

export default Profile;