import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <nav className="flex space-x-4 items-center">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/products" className="hover:underline">Products</Link>
          <Link href="/orders" className="hover:underline">Orders</Link>
          <Link href="/integrations" className="hover:underline">Integrations</Link>
          <Link href="/automations" className="hover:underline">Automations</Link>
          {session ? (
            <>
              <Link href="/profile" className="hover:underline">Profile</Link>
              <button onClick={() => signOut()} className="ml-2 underline">Logout</button>
            </>
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
