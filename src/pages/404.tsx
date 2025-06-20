import Link from 'next/link';
import Layout from '../components/Layout';

export default function NotFound() {
  return (
    <Layout>
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="mb-4">Sorry, the page you are looking for does not exist.</p>
        <Link href="/dashboard" className="text-blue-500 underline">
          Back to Dashboard
        </Link>
      </div>
    </Layout>
  );
}
