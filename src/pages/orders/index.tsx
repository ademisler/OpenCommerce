import Layout from '../../components/Layout';
import Link from 'next/link';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface Store {
  id: number;
  name: string;
  baseUrl: string;
  key: string;
  secret: string;
}

interface Order {
  id: number;
  status: string;
  total: number;
}

const fetcher = <T,>(url: string): Promise<T> =>
  fetch(url).then((res) => res.json());

export default function Orders() {
  const { status } = useSession();
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  if (status === 'loading') return null;
  if (status === 'unauthenticated') {
    router.replace('/login');
    return null;
  }
  const [selected, setSelected] = useState<Store | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('wooStores');
    if (saved) {
      const parsed: Store[] = JSON.parse(saved);
      setStores(parsed);
      if (parsed.length > 0) setSelected(parsed[0]);
    }
  }, []);

  const query = selected
    ? `/api/orders?baseUrl=${encodeURIComponent(selected.baseUrl)}&key=${selected.key}&secret=${selected.secret}`
    : null;

  const { data, error } = useSWR<Order[]>(query, fetcher);

  if (error) return <div>Error loading orders.</div>;
  if (!selected) return (
    <Layout>
      <p>No WooCommerce store configured.</p>
    </Layout>
  );
  if (!data) return <div>Loading...</div>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <Link
        href="/orders/create"
        className="inline-block mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Order
      </Link>
      <div className="mb-4">
        <select
          className="border p-2"
          value={selected?.id ?? ''}
          onChange={(e) => {
            const store = stores.find((s) => s.id === Number(e.target.value));
            setSelected(store || null);
          }}
        >
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>
      <ul className="space-y-2">
        {data.map((order) => (
          <li key={order.id} className="border p-2 rounded">
            <Link href={`/orders/${order.id}`}>Order #{order.id}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
