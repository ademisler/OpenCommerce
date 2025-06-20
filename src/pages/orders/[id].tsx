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

  const { data, error } = useSWR<OrderData>(query, fetcher);

  if (error) return <div>Error loading order.</div>;
  if (!store) return <div>{t('noStore')}</div>;
  if (!data) return <div>{t('loading')}</div>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">{t('order')} #{data.id}</h1>
      <p>{t('status')}: {data.status}</p>
      <p>{t('total')}: {data.total}</p>
    </Layout>
  );
}
