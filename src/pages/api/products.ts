import type { NextApiRequest, NextApiResponse } from 'next';
import {
  fetchProducts as fetchWooProducts,
  WooConfig,
} from '../../lib/integrations/woocommerceService';

const fallbackProducts: Product[] = [
  {
    id: 1,
    name: 'Example Product',
    stock: 10,
    image: 'https://via.placeholder.com/80',
  },
  {
    id: 2,
    name: 'Demo Product',
    stock: 5,
    image: 'https://via.placeholder.com/80',
  },
];

export type Product = {
  id: number;
  name: string;
  stock: number;
  image: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[] | { error: string }>
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

    const wooProducts = await fetchWooProducts(config);
    const products: Product[] = wooProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      stock: p.stock_quantity ?? 0,
      image: p.images?.[0]?.src || 'https://via.placeholder.com/80',
    }));
    res.status(200).json(products);
  } catch (error) {
    console.error('Failed to fetch products from WooCommerce:', error);
    if (
      error instanceof Error &&
      error.message.startsWith('Missing WooCommerce configuration')
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(200).json(fallbackProducts);
    }
  }
}
