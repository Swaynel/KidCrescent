import { LogOut } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

const AdminHeader = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/admin/login');
  };

  return (
    <header className="bg-gray-900 p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Kid Crescent Admin</h1>
      <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-300 hover:text-white">
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </header>
  );
};

export default AdminHeader;