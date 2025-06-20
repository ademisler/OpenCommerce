export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function sbRequest<T>(
  method: string,
  path: string,
  body?: unknown,
  query?: string
): Promise<T> {
  const url = `${SUPABASE_URL}/rest/v1/${path}${query || ''}`;
  const res = await fetch(url, {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...(method === 'POST' ? { Prefer: 'return=representation' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    throw new Error(`Supabase error ${res.status}`);
  }
  return res.json();
}
