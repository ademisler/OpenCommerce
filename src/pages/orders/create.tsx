import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

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
  image: string;
}

interface OrderItem {
  product_id: number;
  quantity: number;
}

const fetcher = <T,>(url: string): Promise<T> => fetch(url).then((res) => res.json());

export default function CreateOrder() {
  const { status } = useSession();
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [selected, setSelected] = useState<Store | null>(null);
  const [items, setItems] = useState<Record<number, number>>({});

  if (status === 'loading') return null;
  if (status === 'unauthenticated') {
    router.replace('/login');
    return null;
  }

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
  const { data } = useSWR<Product[]>(query, fetcher);

  const create = async () => {
    if (!selected) return;
    const lineItems: OrderItem[] = Object.entries(items)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => ({ product_id: Number(id), quantity: qty }));
    if (lineItems.length === 0) return;
    await fetch(
      `/api/orders/create?baseUrl=${encodeURIComponent(selected.baseUrl)}&key=${selected.key}&secret=${selected.secret}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: lineItems }),
      }
    );
    router.push('/orders');
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Create Order</h1>
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
      {!data ? (
        <p>Loading products...</p>
      ) : (
        <div className="space-y-2">
          {data.map((p) => (
            <div key={p.id} className="flex items-center space-x-4 border p-2 rounded">
              <img src={p.image} alt={p.name} className="w-16 h-16 object-cover" />
              <div className="flex-1">
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-600">Stock: {p.stock}</p>
              </div>
              <input
                type="number"
                min="0"
                className="border p-1 w-20"
                value={items[p.id] ?? 0}
                onChange={(e) => setItems({ ...items, [p.id]: Number(e.target.value) })}
              />
            </div>
          ))}
        </div>
      )}
      <button onClick={create} className="mt-4 bg-blue-500 text-white px-4 py-2">
        Create Order
      </button>
    </Layout>
  );
}

