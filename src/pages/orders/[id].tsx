import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import useSWR from 'swr';
import { fetcher } from '../../lib/fetcher';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useI18n } from '../../lib/i18n';
import useStores from '../../lib/hooks/useStores';

interface Store {
  id: number;
  name: string;
  baseUrl: string;
  key: string;
  secret: string;
}


export default function OrderDetail() {
  const { status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const { data: stores = [] } = useStores();
  const [store, setStore] = useState<Store | null>(null);
  const { t } = useI18n();
  if (status === 'loading') return null;
  if (status === 'unauthenticated') {
    router.replace('/login');
    return null;
  }

  useEffect(() => {
    if (stores && stores.length > 0) setStore(stores[0]);
  }, [stores]);

  const query =
    id && store ? `/api/orders/${id}?storeId=${store.id}` : null;

  interface OrderData {
    id: number;
    status: string;
    total: number;
  }

  const { data, mutate, error } = useSWR<OrderData>(query, fetcher);
  const [newStatus, setNewStatus] = useState('');

  if (error) return <div>Error loading order.</div>;
  if (!store) return <div>{t('noStore')}</div>;
  if (!data) return <div>{t('loading')}</div>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">{t('order')} #{data.id}</h1>
      <p>{t('total')}: {data.total}</p>
      <div className="space-y-2 mt-4">
        <select
          className="border p-2"
          value={newStatus || data.status}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="processing">processing</option>
          <option value="completed">completed</option>
          <option value="cancelled">cancelled</option>
        </select>
        <div className="space-x-2">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={async () => {
              await fetch(`/api/orders/${data.id}?storeId=${store.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus || data.status }),
              });
              mutate();
            }}
          >
            {t('update')}
          </button>
          <button
            className="bg-red-600 text-white px-3 py-1 rounded"
            onClick={async () => {
              await fetch(`/api/orders/${data.id}?storeId=${store.id}`, {
                method: 'DELETE',
              });
              router.push('/orders');
            }}
          >
            {t('delete')}
          </button>
        </div>
      </div>
    </Layout>
  );
}
