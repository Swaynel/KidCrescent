import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const useTracksForRelease = (releaseId) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!releaseId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'tracks'),
      where('releaseId', '==', releaseId),
      orderBy('trackNumber')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTracks(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [releaseId]);

  return { tracks, loading };
};

export { useTracksForRelease };