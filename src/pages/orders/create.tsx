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
    <Layout>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
        <input
          className="border p-2"
          placeholder={t('firstName')}
          value={customer.first_name}
          onChange={(e) => setCustomer({ ...customer, first_name: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder={t('lastName')}
          value={customer.last_name}
          onChange={(e) => setCustomer({ ...customer, last_name: e.target.value })}
        />
        <input
          className="border p-2 col-span-1 md:col-span-2"
          placeholder={t('company')}
          value={customer.company}
          onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
        />
        <select
          className="border p-2 col-span-1 md:col-span-2"
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
        <input
          className="border p-2 col-span-1 md:col-span-2"
          placeholder={t('houseNumber')}
          value={customer.address_1}
          onChange={(e) => setCustomer({ ...customer, address_1: e.target.value })}
        />
        <input
          className="border p-2 col-span-1 md:col-span-2"
          placeholder={t('apartment')}
          value={customer.address_2}
          onChange={(e) => setCustomer({ ...customer, address_2: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder={t('postcode')}
          value={customer.postcode}
          onChange={(e) => setCustomer({ ...customer, postcode: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder={t('city')}
          value={customer.city}
          onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder={t('phone')}
          value={customer.phone}
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder={t('emailAddress')}
          value={customer.email}
          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
        />
        <textarea
          className="border p-2 col-span-1 md:col-span-2"
          placeholder={t('notes')}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <input
          className="border p-2 w-full"
          placeholder={t('searchProducts')}
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
        />
      </div>
      {!data ? (
        <p>{t('loadingProducts')}</p>
      ) : (
        <div className="space-y-2">
          {data
            .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
            .map((p) => (
              <div key={p.id} className="flex items-center space-x-4 border p-2 rounded">
                <img src={p.image} alt={p.name} className="w-16 h-16 object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-600">Stock: {p.stock}</p>
                </div>
                <input
                  type="number"
                  min="0"
                  className="border p-1 w-20"
                  value={items[p.id] ?? 0}
                  onChange={(e) => setItems({ ...items, [p.id]: Number(e.target.value) })}
                />
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded-md flex items-center"
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
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-md">
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

