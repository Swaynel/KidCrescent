import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db, Timestamp } from '../../lib/firebase';
import EventsForm from './EventsForm';

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate()
      }));
      setEvents(data);
    });

    return unsubscribe;
  }, []);

  const handleDeleteEvent = async (id) => {
    if (confirm('Are you sure?')) {
      await deleteDoc(doc(db, 'events', id));
    }
  };

  const handleSaveEvent = async (formData) => {
    const data = {
      ...formData,
      date: Timestamp.fromDate(new Date(formData.date)),
      price: formData.price || 0
    };

    if (editingEvent) {
      await updateDoc(doc(db, 'events', editingEvent.id), data);
    } else {
      await addDoc(collection(db, 'events'), data);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-white text-black px-4 py-2 rounded font-semibold hover:bg-gray-200"
        >
          Add New Event
        </button>
      </div>

      <div className="bg-gray-900 rounded-lg p-6">
        {events.map((event) => (
          <div key={event.id} className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0">
            <div>
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-400">{event.venue}, {event.city} • {event.date?.toLocaleDateString()}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditingEvent(event)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {(showAddForm || editingEvent) && (
        <EventsForm
          event={editingEvent}
          onClose={() => {
            setShowAddForm(false);
            setEditingEvent(null);
          }}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
};

export default EventsManager;