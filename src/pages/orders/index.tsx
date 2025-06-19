import Layout from '../../components/Layout';
import Link from 'next/link';
import useSWR from 'swr';

interface Order {
  id: number;
  status: string;
  total: number;
}

const fetcher = <T,>(url: string): Promise<T> =>
  fetch(url).then((res) => res.json());

export default function Orders() {
  const { data, error } = useSWR<Order[]>('/api/orders', fetcher);

  if (error) return <div>Error loading orders.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <ul className="space-y-2">
        {data.map((order) => (
          <li key={order.id} className="border p-2 rounded">
            <Link href={`/orders/${order.id}`}>Order #{order.id}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
