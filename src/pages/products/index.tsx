import Layout from '../../components/Layout';
import useSWR from 'swr';
import { fetcher } from '../../lib/fetcher';
import { EditIcon, PlusIcon } from '../../components/Icons';
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
  price: number;
  ean: string;
}

interface Category {
  id: number;
  name: string;
  parent: number;
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
  const [newCat, setNewCat] = useState('');
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
  const catQuery = selected ? `/api/categories?storeId=${selected.id}` : null;
  const { data: categories = [] } = useSWR<Category[]>(catQuery, fetcher);

  if (error) return <div>Error loading products.</div>;
  if (!selected) return (
    <Layout title={t('products')}>
      <p>{t('noStore')}</p>
    </Layout>
  );
  if (!data) return <div>{t('loading')}</div>;

  const filtered = data.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title={t('products')}>
      <h1 className="text-2xl font-bold mb-4">{t('products')}</h1>
      <div className="mb-4">
        <select
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2"
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
        <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
          {t('searchProducts')}
        </label>
        <input
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul className="space-y-2">
        {filtered.map((product) => (
          <li key={product.id} className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800">
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
                className="text-blue-600 hover:underline flex items-center"
                onClick={() => {
                  setEditing(product.id);
                  setForm(product);
                }}
              >
                <EditIcon className="w-4 h-4 mr-1" /> Edit
              </button>
            </div>
            {expanded === product.id && (
              <div className="mt-2">
                <img src={product.image} alt={product.name} className="w-64 h-64 object-contain mx-auto" />
                <div className="prose text-sm mt-2">
                  <p>Categories: {product.categories.join(', ') || '-'}</p>
                  <p>Price: {product.price}</p>
                  <p>EAN: {product.ean}</p>
                  <p>Weight: {product.weight}</p>
                  <p>
                    Dimensions: {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height}
                  </p>
                </div>
              </div>
            )}
            {editing === product.id && (
              <div className="mt-2 space-y-2">
                <div>
                  <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">Name</label>
                  <input
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-1 w-full"
                    value={form.name || ''}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">{t('stock')}</label>
                  <input
                    type="number"
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-1 w-full"
                    value={form.stock ?? 0}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">{t('weight')}</label>
                  <input
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-1 w-full"
                    value={form.weight || ''}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">{t('price')}</label>
                  <input
                    type="number"
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-1 w-full"
                    value={form.price ?? 0}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">{t('ean')}</label>
                  <input
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-1 w-full"
                    value={form.ean || ''}
                    onChange={(e) => setForm({ ...form, ean: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div>
                    <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">{t('lengthShort')}</label>
                    <input
                      className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-1 w-full"
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
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">{t('widthShort')}</label>
                    <input
                      className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-1 w-full"
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
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">{t('heightShort')}</label>
                    <input
                      className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-1 w-full"
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
                </div>
                <select
                  multiple
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-1 w-full h-32"
                  value={form.categories || []}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      categories: Array.from(e.target.selectedOptions).map((o) => o.value),
                    })
                  }
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name} style={{ paddingLeft: c.parent ? '1rem' : undefined }}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="flex mt-1">
                  <input
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-1 flex-1"
                    placeholder={t('newCategory')}
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                  />
                  <button
                    type="button"
                    className="ml-2 bg-blue-600 dark:bg-blue-500 text-white px-2 py-1 rounded-md flex items-center dark:border dark:border-gray-600"
                    onClick={() => {
                      if (!newCat) return;
                      setForm({
                        ...form,
                        categories: [...(form.categories || []), newCat],
                      });
                      setNewCat('');
                    }}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {(() => {
                    const changed = Object.keys(form).filter((k) =>
                      JSON.stringify((product as any)[k]) !== JSON.stringify((form as any)[k])
                    );
                    return changed.length > 0
                      ? `Changed: ${changed.join(', ')}`
                      : 'No changes';
                  })()}
                </p>
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-600 dark:bg-blue-500 text-white px-2 py-1 rounded-md flex items-center space-x-1 dark:border dark:border-gray-600"
                    onClick={async () => {
                      await fetch(`/api/products/${product.id}?storeId=${selected?.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(form),
                      });
                      setEditing(null);
                    }}
                  >
                    <span>Save</span>
                  </button>
                  <button className="px-2 py-1 rounded-md dark:border dark:border-gray-600" onClick={() => setEditing(null)}>
                    {t('cancel')}
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
