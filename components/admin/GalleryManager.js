import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db, Timestamp } from '../../lib/firebase';
import GalleryForm from './GalleryForm';

const GalleryManager = () => {
  const [gallery, setGallery] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate()
      }));
      setGallery(data);
    });

    return unsubscribe;
  }, []);

  const handleDeleteGallery = async (id) => {
    if (confirm('Are you sure?')) {
      await deleteDoc(doc(db, 'gallery', id));
    }
  };

  const handleSaveGallery = async (formData) => {
    const data = {
      ...formData,
      featured: formData.featured || false,
      thumbnailUrl: formData.thumbnailUrl || formData.imageUrl,
      uploadedAt: editingGallery ? formData.uploadedAt : Timestamp.now(),
      order: formData.order || 0
    };

    if (editingGallery) {
      await updateDoc(doc(db, 'gallery', editingGallery.id), data);
    } else {
      await addDoc(collection(db, 'gallery'), data);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-white text-black px-4 py-2 rounded font-semibold hover:bg-gray-200"
        >
          Add New Image
        </button>
      </div>

      <div className="bg-gray-900 rounded-lg p-6">
        {gallery.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0">
            <div className="flex items-center space-x-4">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded" />
              )}
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.category} • Order {item.order}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditingGallery(item)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteGallery(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {(showAddForm || editingGallery) && (
        <GalleryForm
          gallery={editingGallery}
          onClose={() => {
            setShowAddForm(false);
            setEditingGallery(null);
          }}
          onSave={handleSaveGallery}
        />
      )}
    </div>
  );
};

export default GalleryManager;