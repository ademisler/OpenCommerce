import Layout from '../../components/Layout';
import useSWR from 'swr';

interface Product {
  id: number;
  name: string;
  stock: number;
}

const fetcher = <T,>(url: string): Promise<T> =>
  fetch(url).then((res) => res.json());

export default function Products() {
  const { data, error } = useSWR<Product[]>('/api/products', fetcher);

  if (error) return <div>Error loading products.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <ul className="space-y-2">
        {data.map((product) => (
          <li key={product.id} className="border p-2 rounded">
            {product.name} - Stock: {product.stock}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
