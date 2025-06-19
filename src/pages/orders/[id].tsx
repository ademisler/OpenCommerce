import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error } = useSWR(id ? `/api/orders/${id}` : null, fetcher);

  if (error) return <div>Error loading order.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Order #{data.id}</h1>
      <p>Status: {data.status}</p>
      <p>Total: {data.total}</p>
    </Layout>
  );
}
