import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db, Timestamp } from '../../lib/firebase';
import ReleaseForm from './ReleaseForm';

const ReleaseManager = () => {
  const [releases, setReleases] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRelease, setEditingRelease] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'releases'), (snapshot) => {
      const releasesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        releaseDate: doc.data().releaseDate?.toDate()
      }));
      setReleases(releasesData);
    });

    return unsubscribe;
  }, []);

  const handleDeleteRelease = async (id) => {
    if (confirm('Are you sure?')) {
      await deleteDoc(doc(db, 'releases', id));
    }
  };

  const handleSaveRelease = async (formData) => {
    const data = {
      ...formData,
      releaseDate: Timestamp.fromDate(new Date(formData.releaseDate)),
      featured: formData.featured || false,
      streamingLinks: formData.streamingLinks || {},
      stats: formData.stats || { plays: 0, likes: 0, shares: 0 }
    };

    if (editingRelease) {
      await updateDoc(doc(db, 'releases', editingRelease.id), data);
    } else {
      await addDoc(collection(db, 'releases'), data);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Release Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-white text-black px-4 py-2 rounded font-semibold hover:bg-gray-200"
        >
          Add New Release
        </button>
      </div>

      <div className="bg-gray-900 rounded-lg p-6">
        {releases.map((release) => (
          <div key={release.id} className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0">
            <div className="flex items-center space-x-4">
              {release.artworkUrl && (
                <img src={release.artworkUrl} alt={release.title} className="w-12 h-12 rounded" />
              )}
              <div>
                <h3 className="font-semibold">{release.title}</h3>
                <p className="text-sm text-gray-400">{release.type} • {release.releaseDate?.toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditingRelease(release)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteRelease(release.id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {(showAddForm || editingRelease) && (
        <ReleaseForm
          release={editingRelease}
          onClose={() => {
            setShowAddForm(false);
            setEditingRelease(null);
          }}
          onSave={handleSaveRelease}
        />
      )}
    </div>
  );
};

export default ReleaseManager;