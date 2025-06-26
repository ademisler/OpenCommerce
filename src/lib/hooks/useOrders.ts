import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { Order } from '../types';

export default function useOrders(storeId?: number) {
  const query = storeId !== undefined ? `/api/orders?storeId=${storeId}` : null;
  return useSWR<Order[]>(query, fetcher<Order[]>);
}
