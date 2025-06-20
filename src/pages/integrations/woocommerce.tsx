import { useState } from 'react';
import Layout from '../../components/Layout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useI18n } from '../../lib/i18n';
import useStores, { Store } from '../../lib/hooks/useStores';

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
            {store.name} - {store.baseUrl}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
