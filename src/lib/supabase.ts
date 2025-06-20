export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

function ensureConfig() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase environment variables are missing');
  }
  return { url: SUPABASE_URL, key: SUPABASE_KEY };
}

export async function sbRequest<T>(
  method: string,
  path: string,
  body?: unknown,
  query?: string
): Promise<T> {
  const { url, key } = ensureConfig();
  const reqUrl = `${url}/rest/v1/${path}${query || ''}`;
  const res = await fetch(reqUrl, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
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
