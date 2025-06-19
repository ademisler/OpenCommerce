import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

interface ProfileInfo {
  name: string;
  image: string;
}

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileInfo>({ name: '', image: '' });
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const saved = localStorage.getItem('profileInfo');
    if (saved) {
      setProfile(JSON.parse(saved));
    } else if (session?.user) {
      setProfile({ name: session.user.name || '', image: session.user.image || '' });
    }
  }, [session]);

  const saveProfile = () => {
    localStorage.setItem('profileInfo', JSON.stringify(profile));
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
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="space-y-4 max-w-sm">
        <div>
          <label className="block mb-1">Name</label>
          <input
            className="border p-2 w-full"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1">Profile Image URL</label>
          <input
            className="border p-2 w-full"
            value={profile.image}
            onChange={(e) => setProfile({ ...profile, image: e.target.value })}
          />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2" onClick={saveProfile}>
          Save Profile
        </button>
        <div className="pt-4 space-y-2">
          <label className="block mb-1">Change Password</label>
          <input
            className="border p-2 w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2" onClick={changePassword}>
            Update Password
          </button>
        </div>
        <button className="bg-red-500 text-white px-4 py-2 mt-4" onClick={() => signOut()}>Sign Out</button>
      </div>
    </Layout>
  );
}
