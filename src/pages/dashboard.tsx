import Layout from '../components/Layout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useI18n } from '../lib/i18n';

export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();
  const { t } = useI18n();
  const [stores, setStores] = useState<{ id: number; name: string; baseUrl: string; key: string; secret: string }[]>([]);
  const [selected, setSelected] = useState<{ id: number; name: string; baseUrl: string; key: string; secret: string } | null>(null);

  const fetcher = <T,>(url: string): Promise<T> => fetch(url).then(res => res.json());

  const ordersQuery = selected
    ? `/api/orders?baseUrl=${encodeURIComponent(selected.baseUrl)}&key=${selected.key}&secret=${selected.secret}`
    : null;
  const productsQuery = selected
    ? `/api/products?baseUrl=${encodeURIComponent(selected.baseUrl)}&key=${selected.key}&secret=${selected.secret}`
    : null;

  const { data: orders } = useSWR<any[]>(ordersQuery, fetcher);
  const { data: products } = useSWR<any[]>(productsQuery, fetcher);

  const orderCount = orders?.length ?? 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + (o.total ?? 0), 0) ?? 0;
  const productCount = products?.length ?? 0;
  const totalStock = products?.reduce((sum, p) => sum + (p.stock ?? 0), 0) ?? 0;

  useEffect(() => {
    const saved = localStorage.getItem('wooStores');
    if (saved) {
      const parsed = JSON.parse(saved);
      setStores(parsed);
      if (parsed.length > 0) setSelected(parsed[0]);
    }
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">{t('dashboard')}</h1>
      {stores.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{t('connectedStores')}</h2>
          <ul className="list-disc ml-5 space-y-1">
            {stores.map((s) => (
              <li key={s.id}>
                {s.name} - {s.baseUrl}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="border rounded p-4 text-center">
          <p className="text-sm text-gray-600">{t('productsLabel')}</p>
          <p className="text-xl font-semibold">{productCount}</p>
        </div>
        <div className="border rounded p-4 text-center">
          <p className="text-sm text-gray-600">{t('totalStock')}</p>
          <p className="text-xl font-semibold">{totalStock}</p>
        </div>
        <div className="border rounded p-4 text-center">
          <p className="text-sm text-gray-600">{t('orders')}</p>
          <p className="text-xl font-semibold">{orderCount}</p>
        </div>
        <div className="border rounded p-4 text-center">
          <p className="text-sm text-gray-600">{t('revenue')}</p>
          <p className="text-xl font-semibold">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>
      <p>{t('welcome')}</p>
    </Layout>
  );
}
