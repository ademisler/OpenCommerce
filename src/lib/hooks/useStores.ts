import useSWR from 'swr';

export interface Store {
  id: number;
  name: string;
  baseUrl: string;
  key: string;
  secret: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function useStores() {
  return useSWR<Store[]>('/api/stores', fetcher);
}
