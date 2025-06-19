import Layout from '../../components/Layout';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Products() {
  const { data, error } = useSWR('/api/products', fetcher);

  if (error) return <div>Error loading products.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <ul className="space-y-2">
        {data.map((product: any) => (
          <li key={product.id} className="border p-2 rounded">
            {product.name} - Stock: {product.stock}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
