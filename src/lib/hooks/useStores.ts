import useSWR from 'swr';
import { fetcher } from '../fetcher';

export interface Store {
  id: number;
  name: string;
  baseUrl: string;
  key: string;
  secret: string;
}

const storeFetcher = (url: string) =>
  fetcher<any[]>(url).then((rows) =>
    Array.isArray(rows)
      ? rows.map(({ base_url, ...r }) => ({ ...r, baseUrl: base_url }))
      : rows
  );

export default function useStores() {
  return useSWR<Store[]>('/api/stores', storeFetcher);
}
