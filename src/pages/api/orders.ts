import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchOrders as fetchWooOrders } from '../../lib/integrations/woocommerceService';

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
    const wooOrders = await fetchWooOrders();
    const orders: Order[] = wooOrders.map((o: any) => ({
      id: o.id,
      status: o.status,
      total: parseFloat(o.total),
    }));
    res.status(200).json(orders);
  } catch (error) {
    console.error('Failed to fetch orders from WooCommerce:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
