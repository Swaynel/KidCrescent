import { useState } from 'react';
import FileUpload from './FileUpload';

const TrackForm = ({ track, onClose, onSave, releases }) => {
  const [formData, setFormData] = useState(track || {
    title: '',
    releaseId: '',
    duration: '',
    trackNumber: 1,
    lyrics: '',
    featured: false,
    audioUrl: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    }));
  };

  const handleUploadComplete = (url) => {
    setFormData(prev => ({
      ...prev,
      audioUrl: url
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
          {track ? 'Edit Track' : 'Add New Track'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Title</label>
            <input name="title" value={formData.title} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Release</label>
            <select name="releaseId" value={formData.releaseId} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required>
              <option value="">Select Release</option>
              {releases.map(r => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Track Number</label>
            <input type="number" name="trackNumber" value={formData.trackNumber} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Duration (e.g. 3:45)</label>
            <input name="duration" value={formData.duration} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Lyrics</label>
            <textarea name="lyrics" value={formData.lyrics} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" rows="6" />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="mr-2" />
              Featured
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Audio File</label>
            <FileUpload onUploadComplete={handleUploadComplete} acceptTypes="audio/*" folder="tracks" />
            {formData.audioUrl && <audio src={formData.audioUrl} controls className="mt-2" />}
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

export default TrackForm;