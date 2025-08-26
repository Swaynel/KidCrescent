import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db, Timestamp } from '../../lib/firebase';
import BlogForm from './BlogForm';

const BlogManager = () => {
  const [blog, setBlog] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'blog'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishedAt: doc.data().publishedAt?.toDate()
      }));
      setBlog(data);
    });

    return unsubscribe;
  }, []);

  const handleDeleteBlog = async (id) => {
    if (confirm('Are you sure?')) {
      await deleteDoc(doc(db, 'blog', id));
    }
  };

  const handleSaveBlog = async (formData) => {
    const data = {
      ...formData,
      published: formData.published || false,
      publishedAt: formData.published ? Timestamp.now() : null,
      tags: formData.tags || [],
      author: formData.author || 'Kid Crescent'
    };

    if (editingBlog) {
      await updateDoc(doc(db, 'blog', editingBlog.id), data);
    } else {
      await addDoc(collection(db, 'blog'), data);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-white text-black px-4 py-2 rounded font-semibold hover:bg-gray-200"
        >
          Add New Post
        </button>
      </div>

      <div className="bg-gray-900 rounded-lg p-6">
        {blog.map((post) => (
          <div key={post.id} className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0">
            <div className="flex items-center space-x-4">
              {post.featuredImage && (
                <img src={post.featuredImage} alt={post.title} className="w-12 h-12 rounded" />
              )}
              <div>
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-400">{post.slug} • {post.published ? 'Published' : 'Draft'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditingBlog(post)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteBlog(post.id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {(showAddForm || editingBlog) && (
        <BlogForm
          blog={editingBlog}
          onClose={() => {
            setShowAddForm(false);
            setEditingBlog(null);
          }}
          onSave={handleSaveBlog}
        />
      )}
    </div>
  );
};

export default BlogManager;