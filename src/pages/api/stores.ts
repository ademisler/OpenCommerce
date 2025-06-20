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

  if (req.method === 'GET') {
    const rows = await sbRequest<any[]>('GET', 'woo_stores', undefined, `?email=eq.${email}`);
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    const body = req.body ?? {};
    const inserted = await sbRequest<any[]>('POST', 'woo_stores', [{ ...body, email }]);
    return res.status(200).json(inserted[0]);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end('Method Not Allowed');
}
