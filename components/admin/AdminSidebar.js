import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminSidebar = () => {
  const pathname = usePathname();
  
  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/releases', label: 'Releases', icon: '🎵' },
    { href: '/admin/tracks', label: 'Tracks', icon: '🎶' },
    { href: '/admin/gallery', label: 'Gallery', icon: '📸' },
    { href: '/admin/blog', label: 'Blog', icon: '📝' },
    { href: '/admin/events', label: 'Events', icon: '🎤' },
    { href: '/admin/products', label: 'Products', icon: '🛒' },
    { href: '/admin/orders', label: 'Orders', icon: '📦' },
    { href: '/admin/subscribers', label: 'Subscribers', icon: '👥' },
    { href: '/admin/contacts', label: 'Contact Forms', icon: '💌' },
    { href: '/admin/support', label: 'Support', icon: '🆘' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <nav className="w-64 bg-gray-900 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                pathname === item.href 
                  ? 'bg-white text-black' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminSidebar;