import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '../../lib/fetcher';
import { useI18n } from '../../lib/i18n';
import useStores from '../../lib/hooks/useStores';
import { europeanCountries } from '../../utils/europeanCountries';
import { PlusIcon, TrashIcon } from '../../components/Icons';

interface Store {
  id: number;
  name: string;
  baseUrl: string;
  key: string;
  secret: string;
}

interface Product {
  id: number;
  name: string;
  stock: number;
  image: string;
}

interface OrderItem {
  product_id: number;
  quantity: number;
}


export default function CreateOrder() {
  const { status } = useSession();
  const router = useRouter();
  const { data: stores = [] } = useStores();
  const [selected, setSelected] = useState<Store | null>(null);
  const [items, setItems] = useState<Record<number, number>>({});
  const [productSearch, setProductSearch] = useState('');
  const { t } = useI18n();
  const [customer, setCustomer] = useState({
    first_name: '',
    last_name: '',
    company: '',
    country: '',
    address_1: '',
    address_2: '',
    postcode: '',
    city: '',
    phone: '',
    email: '',
  });
  const [note, setNote] = useState('');

  useEffect(() => {
    if (stores && stores.length > 0) setSelected(stores[0]);
  }, [stores]);

  const query = selected ? `/api/products?storeId=${selected.id}` : null;
  const { data } = useSWR<Product[]>(query, fetcher);

  const create = async () => {
    if (!selected) return;
    const lineItems: OrderItem[] = (Object.entries(items) as [string, number][]) 
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => ({ product_id: Number(id), quantity: qty }));
    if (lineItems.length === 0) return;
    await fetch(`/api/orders/create?storeId=${selected.id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: lineItems, customer, note }),
      }
    );
    router.push('/orders');
  };

  return (
    <Layout title={t('createOrder')}>
      <h1 className="text-2xl font-bold mb-4">{t('createOrder')}</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
            {t('firstName')}
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
            value={customer.first_name}
            onChange={(e) => setCustomer({ ...customer, first_name: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
            {t('lastName')}
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
            value={customer.last_name}
            onChange={(e) => setCustomer({ ...customer, last_name: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
            {t('company')}
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
            value={customer.company}
            onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
            {t('country')}
          </label>
          <select
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
            value={customer.country}
            onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
          >
          <option value="">{t('country')}</option>
          {europeanCountries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
            {t('houseNumber')}
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
            value={customer.address_1}
            onChange={(e) => setCustomer({ ...customer, address_1: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
            {t('apartment')}
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
            value={customer.address_2}
            onChange={(e) => setCustomer({ ...customer, address_2: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
            {t('postcode')}
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
            value={customer.postcode}
            onChange={(e) => setCustomer({ ...customer, postcode: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
            {t('city')}
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
            value={customer.city}
            onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
            {t('phone')}
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
            {t('emailAddress')}
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
            value={customer.email}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
            {t('notes')}
          </label>
          <textarea
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
          {t('searchProducts')}
        </label>
        <input
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
        />
      </div>
      {!data ? (
        <p>{t('loadingProducts')}</p>
      ) : (
        <div className="space-y-2 pb-64">
          {data
            .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
            .map((p) => (
              <div key={p.id} className="flex items-center space-x-4 border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800">
                <img src={p.image} alt={p.name} className="w-16 h-16 object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-600">Stock: {p.stock}</p>
                </div>
                <input
                  type="number"
                  min="0"
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-1 w-20 text-gray-700 dark:text-gray-200"
                  value={items[p.id] ?? 0}
                  onChange={(e) => setItems({ ...items, [p.id]: Number(e.target.value) })}
                />
                <button
                  className="bg-green-500 dark:bg-green-600 text-white px-2 py-1 rounded-md flex items-center dark:border dark:border-gray-600"
                  onClick={() => {
                    setItems({ ...items, [p.id]: (items[p.id] ?? 0) + 1 });
                  }}
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
        </div>
      )}
      {Object.keys(items).length > 0 && (
        <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-600 p-4 shadow-md max-h-[50vh] overflow-y-auto mt-4">
          <h2 className="font-semibold mb-2">{t('cart')}</h2>
          <ul className="space-y-1">
            {Object.entries(items)
              .filter(([, qty]) => qty > 0)
              .map(([id, qty]) => {
                const prod = data?.find((d) => d.id === Number(id));
                return (
                  <li key={id} className="flex justify-between items-center">
                    <span>
                      {prod?.name || id} x {qty}
                    </span>
                    <button
                      type="button"
                      className="text-red-600 p-1"
                      onClick={() => {
                        const newItems = { ...items } as Record<number, number>;
                        delete newItems[Number(id)];
                        setItems(newItems);
                      }}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </li>
                );
              })}
          </ul>
          <button
            onClick={create}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          >
            {t('createOrder')}
          </button>
        </div>
      )}
    </Layout>
  );
}

