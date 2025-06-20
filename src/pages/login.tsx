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
    <Layout>
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold mb-4">{t('login')}</h1>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            className="border p-2 w-full"
            type="email"
            placeholder={t('email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="border p-2 w-full"
            type="password"
            placeholder={t('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="bg-blue-500 text-white px-4 py-2 w-full" type="submit">
            {t('signIn')}
          </button>
        </form>
      </div>
    </Layout>
  );
}
