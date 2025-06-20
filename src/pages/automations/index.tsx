import Layout from '../../components/Layout';
import { useI18n } from '../../lib/i18n';

export default function Automations() {
  const { t } = useI18n();
  return (
    <Layout title={t('automations')}>
      <h1 className="text-2xl font-bold mb-4">{t('automations')}</h1>
      <p>{t('automationsIntro')}</p>
    </Layout>
  );
}
