import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { sbRequest } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  const email = session.user.email;
  const { id } = req.query as { id?: string };

  if (req.method === 'DELETE') {
    if (!id) {
      return res.status(400).json({ error: 'Missing id' });
    }
    await sbRequest('DELETE', 'woo_stores', undefined, `?id=eq.${id}&email=eq.${email}`);
    return res.status(204).end();
  }

  res.setHeader('Allow', ['DELETE']);
  return res.status(405).end('Method Not Allowed');
}
