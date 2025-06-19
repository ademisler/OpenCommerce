import Layout from '../../components/Layout';
import Link from 'next/link';

export default function Integrations() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Integrations</h1>
      <p className="mb-4">Manage your platform integrations here.</p>
      <ul className="space-y-2">
        <li>
          <Link href="/integrations/woocommerce" className="underline text-blue-600">
            WooCommerce
          </Link>
        </li>
      </ul>
    </Layout>
  );
}
