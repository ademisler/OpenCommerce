import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useI18n } from '../../lib/i18n';
import useStores, { Store } from '../../lib/hooks/useStores';

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

const fetcher = <T,>(url: string): Promise<T> => fetch(url).then((res) => res.json());

export default function CreateOrder() {
  const { status } = useSession();
  const router = useRouter();
  const { data: stores } = useStores();
  const [selected, setSelected] = useState<Store | null>(null);
  const [items, setItems] = useState<Record<number, number>>({});
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

  const query = selected
    ? `/api/products?baseUrl=${encodeURIComponent(selected.baseUrl)}&key=${selected.key}&secret=${selected.secret}`
    : null;
  const { data } = useSWR<Product[]>(query, fetcher);

  const create = async () => {
    if (!selected) return;
    const lineItems: OrderItem[] = (Object.entries(items) as [string, number][]) 
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => ({ product_id: Number(id), quantity: qty }));
    if (lineItems.length === 0) return;
    await fetch(
      `/api/orders/create?baseUrl=${encodeURIComponent(selected.baseUrl)}&key=${selected.key}&secret=${selected.secret}`,
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
          <option value="TR">Turkey</option>
          <option value="US">United States</option>
          <option value="FR">France</option>
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
      {!data ? (
        <p>{t('loadingProducts')}</p>
      ) : (
        <div className="space-y-2">
          {data.map((p) => (
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
            </div>
          ))}
        </div>
      )}
      <button onClick={create} className="mt-4 bg-blue-500 text-white px-4 py-2">
        {t('createOrder')}
      </button>
    </Layout>
  );
}

