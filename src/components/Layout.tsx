import React from 'react';
import Link from 'next/link';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <nav className="flex space-x-4">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/products" className="hover:underline">Products</Link>
          <Link href="/orders" className="hover:underline">Orders</Link>
          <Link href="/integrations" className="hover:underline">Integrations</Link>
          <Link href="/automations" className="hover:underline">Automations</Link>
        </nav>
      </header>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default Layout;
