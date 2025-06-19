import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchOrders as fetchWooOrders } from '../../../lib/integrations/woocommerceService';

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
    const { id } = req.query;
    const wooOrders = await fetchWooOrders();
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
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}
