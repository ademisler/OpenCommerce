import Layout from '../components/Layout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [stores, setStores] = useState<{ id: number; name: string; baseUrl: string }[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('wooStores');
    if (saved) {
      setStores(JSON.parse(saved));
    }
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {stores.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Connected Stores</h2>
          <ul className="list-disc ml-5 space-y-1">
            {stores.map((s) => (
              <li key={s.id}>
                {s.name} - {s.baseUrl}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p>Welcome to your e-commerce management dashboard.</p>
    </Layout>
  );
}
