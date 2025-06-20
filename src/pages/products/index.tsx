import Layout from '../../components/Layout';
import useSWR from 'swr';
import { fetcher } from '../../lib/fetcher';
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
  categories: string[];
  weight: string;
  dimensions: { length: string; width: string; height: string };
}


export default function Products() {
  const { status } = useSession();
  const router = useRouter();
  const { data: stores = [] } = useStores();
  const [selected, setSelected] = useState<Store | null>(null);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
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
          <li key={product.id} className="border p-2 rounded">
            <div className="flex items-center space-x-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover cursor-pointer"
                onClick={() => setExpanded(expanded === product.id ? null : product.id)}
              />
              <div className="flex-1">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">Stock: {product.stock}</p>
              </div>
              <button
                className="text-blue-600 hover:underline"
                onClick={() => {
                  setEditing(product.id);
                  setForm(product);
                }}
              >
                Edit
              </button>
            </div>
            {expanded === product.id && (
              <div className="mt-2">
                <img src={product.image} alt={product.name} className="w-64 h-64 object-contain mx-auto" />
                <div className="prose text-sm mt-2">
                  <p>Categories: {product.categories.join(', ') || '-'}</p>
                  <p>Weight: {product.weight}</p>
                  <p>
                    Dimensions: {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height}
                  </p>
                </div>
              </div>
            )}
            {editing === product.id && (
              <div className="mt-2 space-y-2">
                <input
                  className="border p-1 w-full"
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  type="number"
                  className="border p-1 w-full"
                  value={form.stock ?? 0}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                />
                <input
                  className="border p-1 w-full"
                  placeholder="Weight"
                  value={form.weight || ''}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                />
                <div className="grid grid-cols-3 gap-1">
                  <input
                    className="border p-1"
                    placeholder="L"
                    value={form.dimensions?.length || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        dimensions: {
                          length: e.target.value,
                          width: form.dimensions?.width ?? '',
                          height: form.dimensions?.height ?? '',
                        },
                      })
                    }
                  />
                  <input
                    className="border p-1"
                    placeholder="W"
                    value={form.dimensions?.width || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        dimensions: {
                          length: form.dimensions?.length ?? '',
                          width: e.target.value,
                          height: form.dimensions?.height ?? '',
                        },
                      })
                    }
                  />
                  <input
                    className="border p-1"
                    placeholder="H"
                    value={form.dimensions?.height || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        dimensions: {
                          length: form.dimensions?.length ?? '',
                          width: form.dimensions?.width ?? '',
                          height: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <input
                  className="border p-1 w-full"
                  placeholder="Categories (comma separated)"
                  value={form.categories?.join(',') || ''}
                  onChange={(e) => setForm({ ...form, categories: e.target.value.split(',') })}
                />
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1"
                    onClick={async () => {
                      await fetch(`/api/products/${product.id}?storeId=${selected?.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(form),
                      });
                      setEditing(null);
                    }}
                  >
                    Save
                  </button>
                  <button className="px-2 py-1" onClick={() => setEditing(null)}>
                    Cancel
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
