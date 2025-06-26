import type { NextApiRequest, NextApiResponse } from 'next';
import { sendOrderEmail, WooConfig } from '../../../../lib/integrations/woocommerceService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { sbRequest } from '../../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean } | { error: string }>
) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end('Method Not Allowed');
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    const { id, storeId } = req.query as { id?: string; storeId?: string };
    if (!storeId) {
      return res.status(400).json({ error: 'Missing storeId' });
    }

    const rows = await sbRequest<any[]>(
      'GET',
      'woo_stores',
      undefined,
      `?id=eq.${storeId}&email=eq.${session.user.email}&limit=1`
    );
    const store = rows[0];
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const config: WooConfig = {
      baseUrl: store.base_url,
      consumerKey: store.key,
      consumerSecret: store.secret,
    };

    const { template } = req.body as { template: string };
    await sendOrderEmail(Number(id), template, config);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Send email error' });
  }
}
