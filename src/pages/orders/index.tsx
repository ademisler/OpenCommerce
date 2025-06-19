import Layout from '../../components/Layout';
import Link from 'next/link';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Orders() {
  const { data, error } = useSWR('/api/orders', fetcher);

  if (error) return <div>Error loading orders.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <ul className="space-y-2">
        {data.map((order: any) => (
          <li key={order.id} className="border p-2 rounded">
            <Link href={`/orders/${order.id}`}>Order #{order.id}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
