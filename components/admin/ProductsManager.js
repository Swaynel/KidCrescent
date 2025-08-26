import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import ProductsForm from './ProductsForm';

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(data);
    });

    return unsubscribe;
  }, []);

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure?')) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  const handleSaveProduct = async (formData) => {
    const data = {
      ...formData,
      price: formData.price * 100, // to cents
      images: formData.images || [],
      active: formData.active || true
    };

    if (editingProduct) {
      await updateDoc(doc(db, 'products', editingProduct.id), data);
    } else {
      await addDoc(collection(db, 'products'), data);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-white text-black px-4 py-2 rounded font-semibold hover:bg-gray-200"
        >
          Add New Product
        </button>
      </div>

      <div className="bg-gray-900 rounded-lg p-6">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0">
            <div className="flex items-center space-x-4">
              {product.images[0] && (
                <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded" />
              )}
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-400">{product.category} • ${product.price / 100}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditingProduct(product)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {(showAddForm || editingProduct) && (
        <ProductsForm
          product={editingProduct ? { ...editingProduct, price: editingProduct.price / 100 } : null}
          onClose={() => {
            setShowAddForm(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default ProductsManager;