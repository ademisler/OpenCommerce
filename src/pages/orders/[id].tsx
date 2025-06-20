import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useI18n } from '../../lib/i18n';

interface Store {
  id: number;
  name: string;
  baseUrl: string;
  key: string;
  secret: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function OrderDetail() {
  const { status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [store, setStore] = useState<Store | null>(null);
  const { t } = useI18n();
  if (status === 'loading') return null;
  if (status === 'unauthenticated') {
    router.replace('/login');
    return null;
  }

  useEffect(() => {
    const saved = localStorage.getItem('wooStores');
    if (saved) {
      const parsed: Store[] = JSON.parse(saved);
      if (parsed.length > 0) setStore(parsed[0]);
    }
  }, []);

  const query =
    id && store
      ? `/api/orders/${id}?baseUrl=${encodeURIComponent(store.baseUrl)}&key=${store.key}&secret=${store.secret}`
      : null;

  const { data, error } = useSWR(query, fetcher);

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
