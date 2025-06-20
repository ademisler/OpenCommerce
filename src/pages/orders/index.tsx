import Layout from '../../components/Layout';
import Link from 'next/link';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useI18n } from '../../lib/i18n';
import useStores from '../../lib/hooks/useStores';
import { fetcher } from '../../utils/fetcher';

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


export default function Orders() {
  const { status } = useSession();
  const router = useRouter();
  const { data: stores = [] } = useStores();
  const [selected, setSelected] = useState<Store | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (stores && stores.length > 0) setSelected(stores[0]);
  }, [stores]);

  if (status === 'loading' || status === 'unauthenticated') return null;

  const query = selected ? `/api/orders?storeId=${selected.id}` : null;

  const { data, error } = useSWR<Order[]>(query, fetcher);

  if (error) return <div>Error loading orders.</div>;
  if (!selected) return (
    <Layout>
      <p>{t('noStore')}</p>
    </Layout>
  );
  if (!data) return <div>{t('loading')}</div>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">{t('orders')}</h1>
      <Link
        href="/orders/create"
        className="inline-block mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {t('createOrder')}
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
            <Link href={`/orders/${order.id}`}>{t('order')} #{order.id}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
