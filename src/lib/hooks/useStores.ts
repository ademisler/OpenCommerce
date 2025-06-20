import useSWR from 'swr';

export interface Store {
  id: number;
  name: string;
  baseUrl: string;
  key: string;
  secret: string;
}

const fetcher = (url: string) =>
  fetch(url)
    .then(res => res.json())
    .then((rows) =>
      Array.isArray(rows)
        ? rows.map(({ base_url, ...r }) => ({ ...r, baseUrl: base_url }))
        : rows
    );

export default function useStores() {
  return useSWR<Store[]>('/api/stores', fetcher);
}
