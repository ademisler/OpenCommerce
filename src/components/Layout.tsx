import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useI18n, Lang } from '../lib/i18n';
import { useTheme } from '../lib/theme';
import { SunIcon, MoonIcon } from './Icons';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const { data: session } = useSession();
  const { t, lang, setLang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<{ name: string; image: string }>({ name: '', image: '' });

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    };
    load();
  }, [session]);

  const imageSrc = profile.image || session?.user?.image || 'https://via.placeholder.com/32';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="bg-gray-800 text-white dark:bg-gray-700">
        <nav className="flex items-center container mx-auto p-4">
          <div className="flex space-x-4 flex-1">
            <Link href="/dashboard" className="hover:underline">{t('dashboard')}</Link>
            <Link href="/products" className="hover:underline">{t('products')}</Link>
            <Link href="/orders" className="hover:underline">{t('orders')}</Link>
            <Link href="/integrations" className="hover:underline">{t('integrations')}</Link>
            <Link href="/automations" className="hover:underline">{t('automations')}</Link>
          </div>
          <select
            className="text-black mr-4 p-1 rounded"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
          >
            <option value="en">EN</option>
            <option value="tr">TR</option>
            <option value="fr">FR</option>
          </select>
          <button className="mr-4" onClick={toggleTheme} aria-label={t('theme')}>
            {theme === 'dark' ? (
              <SunIcon className="w-6 h-6" />
            ) : (
              <MoonIcon className="w-6 h-6" />
            )}
          </button>
          {session ? (
            <div className="relative">
              <img
                src={imageSrc}
                alt="profile"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              />
              {menuOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-40 z-10">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                    {t('editProfile')}
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                  >
                    {t('signOut')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hover:underline">{t('login')}</Link>
          )}
        </nav>
      </header>
      <main className="flex-1 p-4 container mx-auto">{children}</main>
    </div>
  );
};

export default Layout;
