import Layout from '../../components/Layout';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useI18n } from '../../lib/i18n';
import useStores, { Store } from '../../lib/hooks/useStores';


interface Product {
  id: number;
  name: string;
  stock: number;
  image: string;
}

const fetcher = <T,>(url: string): Promise<T> => fetch(url).then((res) => res.json());

export default function Products() {
  const { status } = useSession();
  const router = useRouter();
  const { data: stores = [] } = useStores();
  const [selected, setSelected] = useState<Store | null>(null);
  const [search, setSearch] = useState('');
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

  const query = selected ? `/api/products?storeId=${selected.id}` : null;

  const { data, error } = useSWR<Product[]>(query, fetcher);

  if (error) return <div>Error loading products.</div>;
  if (!selected) return (
    <Layout>
      <p>{t('noStore')}</p>
    </Layout>
  );
  if (!data) return <div>{t('loading')}</div>;

  const filtered = data.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">{t('products')}</h1>
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
      <div className="mb-4">
        <input
          className="border p-2 w-full"
          placeholder={t('searchProducts')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul className="space-y-2">
        {filtered.map((product) => (
          <li key={product.id} className="border p-2 rounded flex items-center space-x-4">
            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-600">Stock: {product.stock}</p>
            </div>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
