import Layout from '../components/Layout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();
  if (status === 'loading') return null;
  if (status === 'unauthenticated') {
    router.replace('/login');
    return null;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your e-commerce management dashboard.</p>
    </Layout>
  );
}
