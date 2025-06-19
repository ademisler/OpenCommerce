import useSWR from 'swr';
import { WooConfig } from '../integrations/woocommerceService';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function useOrders(config?: WooConfig) {
  const query = config
    ? `/api/orders?baseUrl=${encodeURIComponent(config.baseUrl)}&key=${config.consumerKey}&secret=${config.consumerSecret}`
    : '/api/orders';
  return useSWR(query, fetcher);
}
