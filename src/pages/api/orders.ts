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
  res: NextApiResponse<Order[]>
) {
  res.status(200).json(orders);
}
