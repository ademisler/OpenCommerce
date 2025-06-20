import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useI18n } from '../lib/i18n';

interface ProfileInfo {
  name: string;
  image: string;
}

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileInfo>({ name: '', image: '' });
  const [password, setPassword] = useState('');
  const { t } = useI18n();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const load = async () => {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else if (session?.user) {
        setProfile({ name: session.user.name || '', image: session.user.image || '' });
      }
    };
    load();
  }, [status, session]);

  const saveProfile = async () => {
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
  };

  const changePassword = () => {
    localStorage.setItem('demoPassword', password);
    setPassword('');
    alert('Password updated locally (demo only)');
  };

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">{t('profile')}</h1>
      <div className="space-y-4 max-w-sm">
        <div>
          <label className="block mb-1">{t('name')}</label>
          <input
            className="border p-2 w-full"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1">{t('profileImage')}</label>
          <input
            className="border p-2 w-full"
            value={profile.image}
            onChange={(e) => setProfile({ ...profile, image: e.target.value })}
          />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2" onClick={saveProfile}>
          {t('saveProfile')}
        </button>
        <div className="pt-4 space-y-2">
          <label className="block mb-1">{t('changePassword')}</label>
          <input
            className="border p-2 w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2" onClick={changePassword}>
            {t('updatePassword')}
          </button>
        </div>
        <button className="bg-red-500 text-white px-4 py-2 mt-4" onClick={() => signOut()}>{t('signOut')}</button>
      </div>
    </Layout>
  );
}
