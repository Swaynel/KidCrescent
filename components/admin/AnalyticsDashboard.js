import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    totalPlays: 0,
    totalSubscribers: 0,
    totalContacts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    popularTracks: [],
    popularProducts: []
  });

  useEffect(() => {
    const subscribersUnsubscribe = onSnapshot(
      collection(db, 'newsletterSubscribers'),
      (snapshot) => {
        setStats(prev => ({
          ...prev,
          totalSubscribers: snapshot.size
        }));
      }
    );

    const contactsUnsubscribe = onSnapshot(
      collection(db, 'contactSubmissions'),
      (snapshot) => {
        setStats(prev => ({
          ...prev,
          totalContacts: snapshot.size
        }));
      }
    );

    const tracksUnsubscribe = onSnapshot(
      query(collection(db, 'tracks'), orderBy('stats.plays', 'desc'), limit(5)),
      (snapshot) => {
        const popularTracks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStats(prev => ({
          ...prev,
          popularTracks
        }));
      }
    );

    const playsUnsubscribe = onSnapshot(
      collection(db, 'plays'),
      (snapshot) => {
        setStats(prev => ({
          ...prev,
          totalPlays: snapshot.size
        }));
      }
    );

    const ordersUnsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      let totalRev = 0;
      snapshot.docs.forEach(doc => {
        totalRev += doc.data().total || 0;
      });
      setStats(prev => ({
        ...prev,
        totalOrders: snapshot.size,
        totalRevenue: totalRev
      }));
    });

    // popular products
    const productsUnsubscribe = onSnapshot(
      query(collection(db, 'products'), orderBy('inventory', 'asc'), limit(5)),
      (snapshot) => {
        const popularProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStats(prev => ({
          ...prev,
          popularProducts
        }));
      }
    );

    return () => {
      subscribersUnsubscribe();
      contactsUnsubscribe();
      tracksUnsubscribe();
      playsUnsubscribe();
      ordersUnsubscribe();
      productsUnsubscribe();
    };
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-sm text-gray-400 uppercase tracking-wide">Total Plays</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalPlays.toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-sm text-gray-400 uppercase tracking-wide">Subscribers</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalSubscribers}</p>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-sm text-gray-400 uppercase tracking-wide">Contact Forms</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalContacts}</p>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-sm text-gray-400 uppercase tracking-wide">Avg. Session</h3>
          <p className="text-2xl font-bold mt-2">3:42</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-sm text-gray-400 uppercase tracking-wide">Orders</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalOrders}</p>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-sm text-gray-400 uppercase tracking-wide">Revenue</h3>
          <p className="text-2xl font-bold mt-2">${(stats.totalRevenue / 100).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Most Popular Tracks</h2>
        <div className="space-y-3">
          {stats.popularTracks.map((track, index) => (
            <div key={track.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 font-mono text-sm">#{index + 1}</span>
                <span className="font-medium">{track.title}</span>
              </div>
              <span className="text-gray-400">{track.stats?.plays || 0} plays</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Low Inventory Products</h2>
        <div className="space-y-3">
          {stats.popularProducts.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 font-mono text-sm">#{index + 1}</span>
                <span className="font-medium">{product.name}</span>
              </div>
              <span className="text-gray-400">{product.inventory} left</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;