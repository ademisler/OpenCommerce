import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Store {
  id: number;
  name: string;
  baseUrl: string;
  key: string;
  secret: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function OrderDetail() {
  const { status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [store, setStore] = useState<Store | null>(null);
  if (status === 'loading') return null;
  if (status === 'unauthenticated') {
    router.replace('/login');
    return null;
  }

  useEffect(() => {
    const saved = localStorage.getItem('wooStores');
    if (saved) {
      const parsed: Store[] = JSON.parse(saved);
      if (parsed.length > 0) setStore(parsed[0]);
    }
  }, []);

  const query =
    id && store
      ? `/api/orders/${id}?baseUrl=${encodeURIComponent(store.baseUrl)}&key=${store.key}&secret=${store.secret}`
      : null;

  const { data, error } = useSWR(query, fetcher);

  if (error) return <div>Error loading order.</div>;
  if (!store) return <div>No WooCommerce store configured.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Order #{data.id}</h1>
      <p>Status: {data.status}</p>
      <p>Total: {data.total}</p>
    </Layout>
  );
}
