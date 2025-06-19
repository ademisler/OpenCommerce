/**
 * WooCommerce integration service.
 * Fetches data from the WooCommerce REST API using credentials
 * provided via environment variables.
 */

const baseUrl = process.env.WOOCOMMERCE_API_URL;
const consumerKey = process.env.WOOCOMMERCE_API_KEY;
const consumerSecret = process.env.WOOCOMMERCE_API_SECRET;

function authHeader(): string | undefined {
  if (!consumerKey || !consumerSecret) return undefined;
  const token = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  return `Basic ${token}`;
}

async function request<T>(endpoint: string): Promise<T> {
  if (!baseUrl || !consumerKey || !consumerSecret) {
    throw new Error('WooCommerce environment variables are not configured');
  }

  const res = await fetch(`${baseUrl}/wp-json/wc/v3/${endpoint}`, {
    headers: {
      Authorization: authHeader() as string,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`WooCommerce API error: ${res.status}`);
  }

  return res.json();
}

export async function fetchProducts(): Promise<any[]> {
  return request<any[]>('products');
}

export async function fetchOrders(): Promise<any[]> {
  return request<any[]>('orders');
}

export async function syncStock() {
  // Example placeholder with retry logic
  const maxRetries = 3;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // TODO: implement real API call
      return;
    } catch (error) {
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error('Failed to sync stock');
}

export async function updateOrderStatus() {
  // TODO: implement real API call
  return;
}
