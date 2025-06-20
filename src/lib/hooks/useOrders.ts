import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function useOrders(storeId?: number) {
  const query = storeId !== undefined ? `/api/orders?storeId=${storeId}` : null;
  return useSWR(query, fetcher);
}
