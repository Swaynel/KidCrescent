import { useState, useEffect } from 'react';
import { collection, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const SupportManager = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'contactSubmissions'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate()
      }));
      setSubmissions(data);
    });

    return unsubscribe;
  }, []);

  const handleUpdateStatus = async (id, status) => {
    await updateDoc(doc(db, 'contactSubmissions', id), { status });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Support Tickets</h1>
      <div className="bg-gray-900 rounded-lg p-6">
        {submissions.map((sub) => (
          <div key={sub.id} className="p-4 border-b border-gray-700 last:border-b-0">
            <h3 className="font-bold">{sub.subject} from {sub.name}</h3>
            <p className="text-sm text-gray-400">Status: {sub.status}</p>
            <p>{sub.message}</p>
            <select onChange={(e) => handleUpdateStatus(sub.id, e.target.value)} value={sub.status} className="bg-gray-800 p-2 rounded mt-2">
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportManager;