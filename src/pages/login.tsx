import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useI18n } from '../lib/i18n';

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { t } = useI18n();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading' || session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (res?.error) {
      setError(res.error);
    } else {
      router.replace('/dashboard');
    }
  };

  return (
    <>
      <Head>
        <title>{`${t('login')} - Fulexo`}</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
        <div className="w-full max-w-md bg-white bg-opacity-70 dark:bg-gray-900 dark:bg-opacity-70 backdrop-blur rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-semibold mb-6 text-center">Fulexo</h1>
          {error && <p className="mb-4 text-red-600 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">{t('email')}</label>
              <input
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full rounded"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">{t('password')}</label>
              <input
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 w-full rounded"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 w-full rounded-md"
              type="submit"
            >
              {t('signIn')}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
