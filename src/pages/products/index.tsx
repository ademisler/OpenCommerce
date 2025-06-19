import Layout from '../../components/Layout';
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

interface Product {
  id: number;
  name: string;
  stock: number;
}

const fetcher = <T,>(url: string): Promise<T> => fetch(url).then((res) => res.json());

export default function Products() {
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
    ? `/api/products?baseUrl=${encodeURIComponent(selected.baseUrl)}&key=${selected.key}&secret=${selected.secret}`
    : null;

  const { data, error } = useSWR<Product[]>(query, fetcher);

  if (error) return <div>Error loading products.</div>;
  if (!selected) return (
    <Layout>
      <p>No WooCommerce store configured.</p>
    </Layout>
  );
  if (!data) return <div>Loading...</div>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
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
        {data.map((product) => (
          <li key={product.id} className="border p-2 rounded">
            {product.name} - Stock: {product.stock}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
