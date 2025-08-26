"use client";

import Link from 'next/link';
import { useAuth } from '../lib/auth';

const Header = () => {
  const { user } = useAuth();
  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/releases', label: 'Music' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/blog', label: 'Blog' },
    { href: '/events', label: 'Events' },
    { href: '/shop', label: 'Shop' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-black p-4 sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Kid Crescent</Link>
        <ul className="flex space-x-6">
          {menuItems.map(item => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-gray-300">
                {item.label}
              </Link>
            </li>
          ))}
          {user ? (
            <>
              <Link href="/profile" className="hover:text-gray-300">Profile</Link>
              <Link href="/cart" className="hover:text-gray-300">Cart</Link>
            </>
          ) : (
            <Link href="/login" className="hover:text-gray-300">Login</Link>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
