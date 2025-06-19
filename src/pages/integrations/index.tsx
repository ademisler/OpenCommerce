import Layout from '../../components/Layout';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Integrations() {
  const { status } = useSession();
  const router = useRouter();
  if (status === 'loading') return null;
  if (status === 'unauthenticated') {
    router.replace('/login');
    return null;
  }
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
