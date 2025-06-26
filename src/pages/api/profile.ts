import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { sbRequest } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  const email = session.user.email;
  try {
    if (req.method === 'GET') {
      const rows = await sbRequest<any[]>(
        'GET',
        'profiles',
        undefined,
        `?email=eq.${email}&limit=1`
      );
      const profile = rows[0] || { name: '', image: '' };
      return res.status(200).json(profile);
    }

    if (req.method === 'POST') {
      const body = req.body ?? {};
      await sbRequest('POST', 'profiles', [{ ...body, email }]);
      return res.status(200).json({ ok: true });
    }
  } catch (error) {
    console.error('Failed to handle profile request:', error);
    if (
      error instanceof Error &&
      error.message.startsWith('Missing Supabase configuration')
    ) {
      return res.status(200).json({ name: '', image: '' });
    }
    return res.status(500).json({ error: 'Server Error' });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end('Method Not Allowed');
}
