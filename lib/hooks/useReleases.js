import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const useReleases = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'releases'), 
      orderBy('releaseDate', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const releasesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        releaseDate: doc.data().releaseDate?.toDate() || new Date()
      }));
      setReleases(releasesData);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  return { releases, loading };
};

export { useReleases };