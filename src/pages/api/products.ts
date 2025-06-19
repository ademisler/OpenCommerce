import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchProducts as fetchWooProducts } from '../../lib/integrations/woocommerceService';

export type Product = {
  id: number;
  name: string;
  stock: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[] | { error: string }>
) {
  try {
    const wooProducts = await fetchWooProducts();
    const products: Product[] = wooProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      stock: p.stock_quantity ?? 0,
    }));
    res.status(200).json(products);
  } catch (error) {
    console.error('Failed to fetch products from WooCommerce:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
