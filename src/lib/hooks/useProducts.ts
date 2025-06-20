import useSWR from 'swr';
import { fetcher } from '../utils/fetcher';

export default function useProducts(storeId?: number) {
  const query =
    storeId !== undefined ? `/api/products?storeId=${storeId}` : null;
  return useSWR(query, fetcher);
}
