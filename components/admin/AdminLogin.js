import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail } from '../../lib/auth';
import { checkAdminRole } from '../../lib/adminAuth';
import { auth } from '../../lib/firebase';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmail(
        credentials.email, 
        credentials.password
      );
      
      const user = userCredential;
      const isAdmin = await checkAdminRole(user);
      
      if (isAdmin) {
        router.push('/admin/dashboard');
      } else {
        setError('Access denied. Admin privileges required.');
        await auth.signOut();
      }
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Admin Login
        </h2>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Admin Email"
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
      </div>
    </div>
  );
};

export default AdminLogin;