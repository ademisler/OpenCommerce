import type { NextApiRequest, NextApiResponse } from 'next';

type Product = {
  id: number;
  name: string;
  stock: number;
};

const products: Product[] = [
  { id: 1, name: 'Example Product 1', stock: 10 },
  { id: 2, name: 'Example Product 2', stock: 5 }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[]>
) {
  res.status(200).json(products);
}
