import useSWR from 'swr';
import { WooConfig } from '../integrations/woocommerceService';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function useProducts(config?: WooConfig) {
  const query = config
    ? `/api/products?baseUrl=${encodeURIComponent(config.baseUrl)}&key=${config.consumerKey}&secret=${config.consumerSecret}`
    : '/api/products';
  return useSWR(query, fetcher);
}
