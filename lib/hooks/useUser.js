import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../auth';

const useUser = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(userRef, (snap) => {
        setUserData(snap.data());
        setLoading(false);
      });
      return unsubscribe;
    } else {
      setLoading(false);
    }
  }, [user]);

  const updateUser = async (data) => {
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), data);
    }
  };

  return { userData, loading, updateUser };
};

export { useUser };