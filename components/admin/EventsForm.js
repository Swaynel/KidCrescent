import { useState } from 'react';

const EventsForm = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState(event || {
    title: '',
    venue: '',
    city: '',
    date: new Date().toISOString().split('T')[0],
    ticketUrl: '',
    price: 0,
    status: 'upcoming',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6">
          {event ? 'Edit Event' : 'Add New Event'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Title</label>
            <input name="title" value={formData.title} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Venue</label>
            <input name="venue" value={formData.venue} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">City</label>
            <input name="city" value={formData.city} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Ticket URL</label>
            <input name="ticketUrl" value={formData.ticketUrl} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Price</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded">
              <option value="upcoming">Upcoming</option>
              <option value="sold-out">Sold Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" rows="4" />
          </div>
          <div className="flex space-x-4">
            <button type="submit" className="bg-white text-black px-4 py-2 rounded">
              Save
            </button>
            <button type="button" onClick={onClose} className="bg-gray-700 px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventsForm;