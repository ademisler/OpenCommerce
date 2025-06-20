import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function useProducts(storeId?: number) {
  const query =
    storeId !== undefined ? `/api/products?storeId=${storeId}` : null;
  return useSWR(query, fetcher);
}
