import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function useProducts() {
  return useSWR('/api/products', fetcher);
}
