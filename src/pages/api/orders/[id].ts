import type { NextApiRequest, NextApiResponse } from 'next';

type Order = {
  id: number;
  status: string;
  total: number;
};

const orders: Order[] = [
  { id: 1, status: 'pending', total: 100 },
  { id: 2, status: 'shipped', total: 200 }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Order | { error: string }>
) {
  const { id } = req.query;
  const order = orders.find(o => o.id === Number(id));
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
}
