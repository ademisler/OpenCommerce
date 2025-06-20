import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useI18n } from '../lib/i18n';

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useI18n();

  if (session) {
    router.replace('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn('credentials', { redirect: true, email, password, callbackUrl: '/dashboard' });
  };

  return (
    <Layout title={t('login')}>
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold mb-4">{t('login')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
              {t('email')}
            </label>
            <input
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
              {t('password')}
            </label>
            <input
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 w-full rounded-md dark:border dark:border-gray-600"
            type="submit"
          >
            {t('signIn')}
          </button>
        </form>
      </div>
    </Layout>
  );
}
