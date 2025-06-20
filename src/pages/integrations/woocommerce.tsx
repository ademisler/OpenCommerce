import { useState } from 'react';
import Layout from '../../components/Layout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useI18n } from '../../lib/i18n';
import useStores from '../../lib/hooks/useStores';

interface Store {
  id: number;
  name: string;
  baseUrl: string;
  key: string;
  secret: string;
}

export default function WooCommerceIntegrations() {
  const { status } = useSession();
  const router = useRouter();
  const { data: stores = [], mutate } = useStores();
  const { t } = useI18n();
  if (status === 'loading') return null;
  if (status === 'unauthenticated') {
    router.replace('/login');
    return null;
  }
  const [name, setName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [key, setKey] = useState('');
  const [secret, setSecret] = useState('');
  const [editing, setEditing] = useState<Store | null>(null);

  const removeStore = async (id: number) => {
    await fetch(`/api/stores/${id}`, { method: 'DELETE' });
    mutate(stores.filter((s) => s.id !== id), false);
  };

  const updateStore = async () => {
    if (!editing) return;
    const payload = {
      name: editing.name,
      baseUrl: editing.baseUrl,
      key: editing.key,
      secret: editing.secret,
    };
    await fetch(`/api/stores/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    mutate();
    setEditing(null);
  };

  const addStore = async () => {
    const payload = { name, baseUrl, key, secret };
    const res = await fetch('/api/stores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const created = await res.json();
      mutate([...(stores || []), created], false);
    }
    setName('');
    setBaseUrl('');
    setKey('');
    setSecret('');
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">{t('wooStores')}</h1>
      <div className="mb-6 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder={t('storeName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder={t('baseUrl')}
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder={t('consumerKey')}
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder={t('consumerSecret')}
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={addStore}>
          {t('addStore')}
        </button>
      </div>
      <ul className="space-y-2">
        {stores.map((store) => (
          <li key={store.id} className="border p-2 rounded">
            {editing?.id === store.id ? (
              <div className="space-y-2">
                <input
                  className="border p-1 w-full"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
                <input
                  className="border p-1 w-full"
                  value={editing.baseUrl}
                  onChange={(e) => setEditing({ ...editing, baseUrl: e.target.value })}
                />
                <input
                  className="border p-1 w-full"
                  value={editing.key}
                  onChange={(e) => setEditing({ ...editing, key: e.target.value })}
                />
                <input
                  className="border p-1 w-full"
                  value={editing.secret}
                  onChange={(e) => setEditing({ ...editing, secret: e.target.value })}
                />
                <div className="flex space-x-2">
                  <button className="bg-blue-500 text-white px-2 py-1" onClick={updateStore}>Save</button>
                  <button className="px-2 py-1" onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span>
                  {store.name} - {store.baseUrl}
                </span>
                <div className="space-x-2">
                  <button className="text-blue-600 hover:underline" onClick={() => setEditing(store)}>Edit</button>
                  <button className="text-red-600 hover:underline" onClick={() => removeStore(store.id)}>
                    {t('remove')}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
