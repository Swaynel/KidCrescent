import { useState } from 'react';
import FileUpload from './FileUpload';

const BlogForm = ({ blog, onClose, onSave }) => {
  const [formData, setFormData] = useState(blog || {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    published: false,
    tags: [],
    author: 'Kid Crescent'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagsChange = (e) => {
    setFormData(prev => ({
      ...prev,
      tags: e.target.value.split(',')
    }));
  };

  const handleUploadComplete = (url) => {
    setFormData(prev => ({
      ...prev,
      featuredImage: url
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
          {blog ? 'Edit Blog Post' : 'Add New Blog Post'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Title</label>
            <input name="title" value={formData.title} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Slug</label>
            <input name="slug" value={formData.slug} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Excerpt</label>
            <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" rows="3" />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Content</label>
            <textarea name="content" value={formData.content} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" rows="8" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Tags (comma separated)</label>
            <input name="tags" value={formData.tags.join(',')} onChange={handleTagsChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Author</label>
            <input name="author" value={formData.author} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} className="mr-2" />
              Published
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Featured Image</label>
            <FileUpload onUploadComplete={handleUploadComplete} folder="blog" />
            {formData.featuredImage && <img src={formData.featuredImage} alt="Featured" className="mt-2 w-32 h-32 object-cover rounded" />}
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

export default BlogForm;