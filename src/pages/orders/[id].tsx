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
    shipping_company?: string;
    tracking_number?: string;
  }

  const { data, mutate, error } = useSWR<OrderData>(query, fetcher);
  const [newStatus, setNewStatus] = useState('');
  const [shippingCompany, setShippingCompany] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    if (data) {
      setShippingCompany(data.shipping_company || '');
      setTrackingNumber(data.tracking_number || '');
    }
  }, [data]);

  if (error) return <div>Error loading order.</div>;
  if (!store) return <div>{t('noStore')}</div>;
  if (!data) return <div>{t('loading')}</div>;

  return (
    <Layout title={t('order')}>
      <h1 className="text-2xl font-bold mb-4">{t('order')} #{data.id}</h1>
      <p>{t('total')}: {data.total}</p>
      <div className="space-y-2 mt-4">
        <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
          {t('status')}
        </label>
        <select
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
          value={newStatus || data.status}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="pending">pending</option>
          <option value="shipped">shipped</option>
          <option value="delivered">delivered</option>
          <option value="cancelled">cancelled</option>
        </select>
        <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200 mt-4">
          {t('shippingCompany')}
        </label>
        <input
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
          value={shippingCompany}
          onChange={(e) => setShippingCompany(e.target.value)}
        />
        <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200 mt-2">
          {t('trackingNumber')}
        </label>
        <input
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <div className="space-x-2">
          <button
            className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-1 rounded dark:border dark:border-gray-600"
            onClick={async () => {
              await fetch(`/api/orders/${data.id}?storeId=${store.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  status: newStatus || data.status,
                  shipping_company: shippingCompany,
                  tracking_number: trackingNumber,
                }),
              });
              mutate();
            }}
          >
            {t('update')}
          </button>
          <button
            className="bg-red-600 dark:bg-red-700 text-white px-3 py-1 rounded dark:border dark:border-gray-600"
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
