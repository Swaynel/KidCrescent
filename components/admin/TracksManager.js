import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import TrackForm from './TrackForm';
import { useReleases } from '../../lib/hooks/useReleases';

const TracksManager = () => {
  const { releases } = useReleases();
  const [tracks, setTracks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrack, setEditingTrack] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'tracks'), orderBy('releaseId'), orderBy('trackNumber'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTracks(data);
    });

    return unsubscribe;
  }, []);

  const handleDeleteTrack = async (id) => {
    if (confirm('Are you sure?')) {
      await deleteDoc(doc(db, 'tracks', id));
    }
  };

  const handleSaveTrack = async (formData) => {
    const data = {
      ...formData,
      featured: formData.featured || false,
      stats: formData.stats || { plays: 0, likes: 0 }
    };

    if (editingTrack) {
      await updateDoc(doc(db, 'tracks', editingTrack.id), data);
    } else {
      await addDoc(collection(db, 'tracks'), data);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Track Management</h1>
        <button onClick={() => setShowAddForm(true)} className="bg-white text-black px-4 py-2 rounded font-semibold hover:bg-gray-200">
          Add New Track
        </button>
      </div>

      <div className="bg-gray-900 rounded-lg p-6">
        {tracks.map((track) => (
          <div key={track.id} className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0">
            <div>
              <h3 className="font-semibold">{track.title}</h3>
              <p className="text-sm text-gray-400">Release: {track.releaseId} • Track #{track.trackNumber}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setEditingTrack(track)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                Edit
              </button>
              <button onClick={() => handleDeleteTrack(track.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {(showAddForm || editingTrack) && (
        <TrackForm
          track={editingTrack}
          onClose={() => {
            setShowAddForm(false);
            setEditingTrack(null);
          }}
          onSave={handleSaveTrack}
          releases={releases}
        />
      )}
    </div>
  );
};

export default TracksManager;