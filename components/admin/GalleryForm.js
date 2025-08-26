import { useState } from 'react';
import FileUpload from './FileUpload';

const GalleryForm = ({ gallery, onClose, onSave }) => {
  const [formData, setFormData] = useState(gallery || {
    title: '',
    altText: '',
    category: 'studio',
    featured: false,
    order: 0,
    imageUrl: ''
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
      imageUrl: url,
      thumbnailUrl: url
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
          {gallery ? 'Edit Gallery Item' : 'Add New Gallery Item'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Title</label>
            <input name="title" value={formData.title} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Alt Text</label>
            <input name="altText" value={formData.altText} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded">
              <option value="studio">Studio</option>
              <option value="live">Live</option>
              <option value="personal">Personal</option>
              <option value="promotional">Promotional</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Order</label>
            <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="mr-2" />
              Featured
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Image</label>
            <FileUpload onUploadComplete={handleUploadComplete} folder="gallery" />
            {formData.imageUrl && <img src={formData.imageUrl} alt="Image" className="mt-2 w-32 h-32 object-cover rounded" />}
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

export default GalleryForm;