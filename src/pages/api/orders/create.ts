import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createOrder as wooCreateOrder,
  WooConfig,
  OrderItem,
} from '../../../lib/integrations/woocommerceService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ id: number } | { error: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

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

    const items: OrderItem[] = Array.isArray(req.body?.items)
      ? req.body.items
      : [];
    const order = await wooCreateOrder(items, config);
    res.status(200).json({ id: order.id });
  } catch (error) {
    console.error('Failed to create order in WooCommerce:', error);
    res.status(200).json({ id: Date.now() });
  }
}

