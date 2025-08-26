import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithEmail, signInWithGoogle } from '../lib/auth';
import Link from 'next/link';

const Signup = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '', displayName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signUpWithEmail(credentials.email, credentials.password, credentials.displayName);
      router.push('/profile');
    } catch (error) {
      setError('Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      router.push('/profile');
    } catch (error) {
      setError('Google sign in failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Sign Up
        </h2>
        
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Display Name"
              value={credentials.displayName}
              onChange={(e) => setCredentials({...credentials, displayName: e.target.value})}
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-white"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-white"
              required
            />
          </div>
          
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-white"
              required
            />
          </div>
          
          {error && (
            <div className="mb-4 text-red-400 text-sm">{error}</div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black p-3 rounded font-semibold hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <button onClick={handleGoogle} className="w-full bg-blue-600 text-white p-3 rounded mt-4">
          Sign up with Google
        </button>
        <p className="mt-4 text-center">
          Have account? <Link href="/login" className="text-blue-400">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;