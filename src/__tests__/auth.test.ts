import { authOptions } from '../pages/api/auth/[...nextauth]';

describe('authorize', () => {
  const provider: any = authOptions.providers[0];
  const authorize = provider.authorize as (cred: any) => Promise<any>;

  beforeEach(() => {
    process.env.AUTH_EMAIL = 'admin@example.com';
    process.env.AUTH_PASSWORD = 'secret';
  });

  it('returns user when credentials match env vars', async () => {
    const user = await authorize({ email: 'admin@example.com', password: 'secret' });
    expect(user).toEqual({ id: '1', name: 'Admin', email: 'admin@example.com' });
  });

  it('returns null when credentials mismatch', async () => {
    const user = await authorize({ email: 'bad', password: 'bad' });
    expect(user).toBeNull();
  });
});
