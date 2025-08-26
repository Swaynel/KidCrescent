import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail, signInWithGoogle } from '../lib/auth';
import Link from 'next/link';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmail(credentials.email, credentials.password);
      router.push('/profile');
    } catch (error) {
      setError('Invalid credentials.');
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
          Login
        </h2>
        
        <form onSubmit={handleLogin}>
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <button onClick={handleGoogle} className="w-full bg-blue-600 text-white p-3 rounded mt-4">
          Sign in with Google
        </button>
        <p className="mt-4 text-center">
          No account? <Link href="/signup" className="text-blue-400">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;