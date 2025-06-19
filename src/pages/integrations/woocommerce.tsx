import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';

interface Store {
  id: number;
  name: string;
  baseUrl: string;
  key: string;
  secret: string;
}

export default function WooCommerceIntegrations() {
  const [stores, setStores] = useState<Store[]>([]);
  const [name, setName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [key, setKey] = useState('');
  const [secret, setSecret] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('wooStores');
    if (saved) {
      setStores(JSON.parse(saved));
    }
  }, []);

  const addStore = () => {
    const newStore: Store = {
      id: Date.now(),
      name,
      baseUrl,
      key,
      secret,
    };
    const updated = [...stores, newStore];
    setStores(updated);
    localStorage.setItem('wooStores', JSON.stringify(updated));
    setName('');
    setBaseUrl('');
    setKey('');
    setSecret('');
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">WooCommerce Stores</h1>
      <div className="mb-6 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Store Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Base URL"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Consumer Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Consumer Secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={addStore}>
          Add Store
        </button>
      </div>
      <ul className="space-y-2">
        {stores.map((store) => (
          <li key={store.id} className="border p-2 rounded">
            {store.name} - {store.baseUrl}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
