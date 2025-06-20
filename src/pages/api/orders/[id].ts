import type { NextApiRequest, NextApiResponse } from 'next';
import {
  fetchOrders as fetchWooOrders,
  WooConfig,
} from '../../../lib/integrations/woocommerceService';

export type Order = {
  id: number;
  status: string;
  total: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Order | { error: string }>
) {
  try {
    const { id, baseUrl, key, secret } = req.query as {
      id?: string;
      baseUrl?: string;
      key?: string;
      secret?: string;
    };

    const config =
      baseUrl && key && secret
        ? {
            baseUrl,
            consumerKey: key,
            consumerSecret: secret,
          }
        : undefined;

    const wooOrders = await fetchWooOrders(config);
    const order = wooOrders.find((o: any) => o.id === Number(id));
    if (order) {
      const result: Order = {
        id: order.id,
        status: order.status,
        total: parseFloat(order.total),
      };
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Failed to fetch order from WooCommerce:', error);
    if (
      error instanceof Error &&
      error.message.startsWith('Missing WooCommerce configuration')
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  }
}
