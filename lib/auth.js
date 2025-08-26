"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Timestamp } from './firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    throw error;
  }
};

export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', result.user.uid), {
      email,
      displayName,
      role: 'fan',
      createdAt: Timestamp.now(),
      profile: {
        avatar: '',
        favoriteGenres: [],
        playlists: []
      }
    });
    return result.user;
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const userDoc = doc(db, 'users', result.user.uid);
    await setDoc(userDoc, {
      email: result.user.email,
      displayName: result.user.displayName,
      role: 'fan',
      createdAt: Timestamp.now(),
      profile: {
        avatar: result.user.photoURL,
        favoriteGenres: [],
        playlists: []
      }
    }, { merge: true });
    return result.user;
  } catch (error) {
    throw error;
  }
};