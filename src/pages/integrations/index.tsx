import Layout from '../../components/Layout';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useI18n } from '../../lib/i18n';

export default function Integrations() {
  const { status } = useSession();
  const router = useRouter();
  const { t } = useI18n();
  if (status === 'loading') return null;
  if (status === 'unauthenticated') {
    router.replace('/login');
    return null;
  }
  return (
    <Layout title={t('integrations')}>
      <h1 className="text-2xl font-bold mb-4">{t('integrations')}</h1>
      <p className="mb-4">{t('manageIntegrations')}</p>
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
