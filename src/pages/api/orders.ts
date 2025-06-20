import type { NextApiRequest, NextApiResponse } from 'next';
import {
  fetchOrders as fetchWooOrders,
  WooConfig,
} from '../../lib/integrations/woocommerceService';

const fallbackOrders: Order[] = [
  { id: 1, status: 'processing', total: 19.99 },
  { id: 2, status: 'completed', total: 5.0 },
];

export type Order = {
  id: number;
  status: string;
  total: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Order[] | { error: string }>
) {
  try {
    const { baseUrl, key, secret } = req.query as Partial<WooConfig> & {
      key?: string;
      secret?: string;
      baseUrl?: string;
    };

    const config =
      baseUrl && key && secret
        ? {
            baseUrl: baseUrl as string,
            consumerKey: key as string,
            consumerSecret: secret as string,
          }
        : undefined;

    const wooOrders = await fetchWooOrders(config);
    const orders: Order[] = wooOrders.map((o: any) => ({
      id: o.id,
      status: o.status,
      total: parseFloat(o.total),
    }));
    res.status(200).json(orders);
  } catch (error) {
    console.error('Failed to fetch orders from WooCommerce:', error);
    if (
      error instanceof Error &&
      error.message.startsWith('Missing WooCommerce configuration')
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(200).json(fallbackOrders);
    }
  }
}
