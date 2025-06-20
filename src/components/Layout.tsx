import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<{ name: string; image: string }>({ name: '', image: '' });

  useEffect(() => {
    const saved = localStorage.getItem('profileInfo');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, [session]);

  const imageSrc = profile.image || session?.user?.image || 'https://via.placeholder.com/32';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <nav className="flex items-center">
          <div className="flex space-x-4 flex-1">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/products" className="hover:underline">Products</Link>
            <Link href="/orders" className="hover:underline">Orders</Link>
            <Link href="/integrations" className="hover:underline">Integrations</Link>
            <Link href="/automations" className="hover:underline">Automations</Link>
          </div>
          {session ? (
            <div className="relative">
              <img
                src={imageSrc}
                alt="profile"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              />
              {menuOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-40 z-10">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                    Edit Profile
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hover:underline">Login</Link>
          )}
        </nav>
      </header>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default Layout;
