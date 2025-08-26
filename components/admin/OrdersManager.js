import { useState, useEffect } from 'react';
import { collection, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setOrders(data);
    });

    return unsubscribe;
  }, []);

  const handleUpdateStatus = async (id, status) => {
    await updateDoc(doc(db, 'orders', id), { status });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>
      <div className="bg-gray-900 rounded-lg p-6">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0">
            <div>
              <h3 className="font-semibold">Order #{order.id}</h3>
              <p className="text-sm text-gray-400">Total: ${order.total / 100} • Status: {order.status}</p>
              <p className="text-sm text-gray-400">User: {order.userId}</p>
            </div>
            <select onChange={(e) => handleUpdateStatus(order.id, e.target.value)} value={order.status} className="bg-gray-800 p-2 rounded">
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersManager;