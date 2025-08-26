import { useState } from 'react';
import FileUpload from './FileUpload';

const ProductsForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState(product || {
    name: '',
    description: '',
    price: 0,
    images: [],
    category: 'merch',
    inventory: 50,
    active: true
  });
  const [newImage, setNewImage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleUploadComplete = (url) => {
    setNewImage(url);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
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
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" rows="4" />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Price ($)</label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded">
              <option value="merch">Merch</option>
              <option value="music">Music</option>
              <option value="tickets">Tickets</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Inventory</label>
            <input type="number" name="inventory" value={formData.inventory} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="mr-2" />
              Active
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Images</label>
            <FileUpload onUploadComplete={handleUploadComplete} folder="products" />
            <div className="flex space-x-2 mt-2">
              {formData.images.map((url, i) => (
                <img key={i} src={url} alt={`Image ${i}`} className="w-16 h-16 object-cover rounded" />
              ))}
            </div>
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

export default ProductsForm;