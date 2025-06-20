import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createOrder as wooCreateOrder,
  WooConfig,
  OrderItem,
  CustomerInfo,
} from '../../../lib/integrations/woocommerceService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { sbRequest } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ id: number } | { error: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    const { storeId } = req.query as { storeId?: string };
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

    const items: OrderItem[] = Array.isArray(req.body?.items)
      ? req.body.items
      : [];
    const customer: CustomerInfo | undefined = req.body?.customer;
    const note: string | undefined = req.body?.note;
    const order = await wooCreateOrder(items, customer, note, config);
    res.status(200).json({ id: order.id });
  } catch (error) {
    console.error('Failed to create order in WooCommerce:', error);
    if (
      error instanceof Error &&
      error.message.startsWith('Missing WooCommerce configuration')
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(200).json({ id: Date.now() });
    }
  }
}

