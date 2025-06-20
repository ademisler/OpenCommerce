import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchCategories as fetchWooCategories, WooConfig } from '../../lib/integrations/woocommerceService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { sbRequest } from '../../lib/supabase';

export interface Category {
  id: number;
  name: string;
  parent: number;
}

const fallbackCategories: Category[] = [
  { id: 1, name: 'Demo', parent: 0 },
  { id: 2, name: 'Example', parent: 0 },
  { id: 3, name: 'Child of Demo', parent: 1 },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Category[] | { error: string }>
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    const { storeId } = req.query as { storeId?: string };
    if (!storeId) {
      return res.status(400).json({ error: 'Missing storeId' });
    }

    const rows = await sbRequest<any[]>(
      'GET',
      'woo_stores',
      undefined,
      `?id=eq.${storeId}&email=eq.${session.user.email}&limit=1`
    );
    const store = rows[0];
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const config: WooConfig = {
      baseUrl: store.base_url,
      consumerKey: store.key,
      consumerSecret: store.secret,
    };

    const wooCats = await fetchWooCategories(config);
    const categories: Category[] = wooCats.map((c: any) => ({
      id: c.id,
      name: c.name,
      parent: c.parent,
    }));
    res.status(200).json(categories);
  } catch (error) {
    console.error('Failed to fetch categories from WooCommerce:', error);
    if (
      error instanceof Error &&
      error.message.startsWith('Missing WooCommerce configuration')
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(200).json(fallbackCategories);
    }
  }
}
