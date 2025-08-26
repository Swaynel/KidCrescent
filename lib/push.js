import { getToken } from 'firebase/messaging';
import { messaging } from './firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';

export const requestPushPermission = async (user) => {
  if (!messaging) return;

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY });
      if (token && user) {
        await updateDoc(doc(db, 'users', user.uid), {
          pushTokens: arrayUnion(token)
        });
      }
    }
  } catch (error) {
    console.error('Push permission error', error);
  }
};