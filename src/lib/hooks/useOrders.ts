import useSWR from 'swr';
import { fetcher } from '../fetcher';

export default function useOrders(storeId?: number) {
  const query = storeId !== undefined ? `/api/orders?storeId=${storeId}` : null;
  return useSWR(query, fetcher);
}
