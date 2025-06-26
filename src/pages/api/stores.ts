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
        'woo_stores',
        undefined,
        `?email=eq.${email}`
      );
      const mapped = rows.map(({ base_url, ...r }) => ({
        ...r,
        baseUrl: base_url,
      }));
      return res.status(200).json(mapped);
    }

    if (req.method === 'POST') {
      const body = req.body ?? {};
      const { baseUrl, ...rest } = body;
      const inserted = await sbRequest<any[]>(
        'POST',
        'woo_stores',
        [{ ...rest, base_url: baseUrl, email }]
      );
      const created = { ...inserted[0], baseUrl: inserted[0].base_url };
      delete (created as any).base_url;
      return res.status(200).json(created);
    }
  } catch (error) {
    console.error('Failed to handle stores request:', error);
    if (
      error instanceof Error &&
      error.message.startsWith('Missing Supabase configuration')
    ) {
      return res.status(200).json([]);
    }
    return res.status(500).json({ error: 'Server Error' });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end('Method Not Allowed');
}
