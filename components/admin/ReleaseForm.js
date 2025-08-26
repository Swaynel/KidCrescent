import { useState } from 'react';
import FileUpload from './FileUpload';

const ReleaseForm = ({ release, onClose, onSave }) => {
  const [formData, setFormData] = useState(release || {
    title: '',
    type: 'album',
    releaseDate: new Date().toISOString().split('T')[0],
    description: '',
    featured: false,
    streamingLinks: {
      spotify: '',
      appleMusic: '',
      soundcloud: ''
    },
    artworkUrl: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      streamingLinks: {
        ...prev.streamingLinks,
        [name]: value
      }
    }));
  };

  const handleUploadComplete = (url) => {
    setFormData(prev => ({
      ...prev,
      artworkUrl: url
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
          {release ? 'Edit Release' : 'Add New Release'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Title</label>
            <input name="title" value={formData.title} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded">
              <option value="album">Album</option>
              <option value="ep">EP</option>
              <option value="single">Single</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Release Date</label>
            <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" rows="4" />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="mr-2" />
              Featured
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Artwork</label>
            <FileUpload onUploadComplete={handleUploadComplete} folder="artwork" />
            {formData.artworkUrl && <img src={formData.artworkUrl} alt="Artwork" className="mt-2 w-32 h-32 object-cover rounded" />}
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Spotify Link</label>
            <input name="spotify" value={formData.streamingLinks.spotify} onChange={handleLinkChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Apple Music Link</label>
            <input name="appleMusic" value={formData.streamingLinks.appleMusic} onChange={handleLinkChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Soundcloud Link</label>
            <input name="soundcloud" value={formData.streamingLinks.soundcloud} onChange={handleLinkChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" />
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

export default ReleaseForm;