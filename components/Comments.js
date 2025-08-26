import { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useComments } from '../lib/hooks/useComments';
import { useAuth } from '../lib/auth';

const Comments = ({ releaseId }) => {
  const { comments } = useComments(releaseId);
  const { user } = useAuth();
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user && comment) {
      await addDoc(collection(db, `releases/${releaseId}/comments`), {
        text: comment,
        userId: user.uid,
        userName: user.displayName,
        createdAt: Timestamp.now()
      });
      setComment('');
    }
  };

  return (
    <div className="mt-4">
      <h3 className="font-bold">Comments</h3>
      <form onSubmit={handleSubmit}>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-2 bg-gray-800 rounded" />
        <button type="submit" disabled={!user} className="bg-white text-black p-2 rounded">Post</button>
      </form>
      <ul>
        {comments.map(c => (
          <li key={c.id}>{c.userName}: {c.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;