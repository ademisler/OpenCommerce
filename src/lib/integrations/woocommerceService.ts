/**
 * WooCommerce integration service.
 * Fetches data from the WooCommerce REST API using credentials
 * provided via environment variables.
 */

export interface WooConfig {
  baseUrl: string;
  consumerKey: string;
  consumerSecret: string;
}

const envConfig: WooConfig | null =
  process.env.WOOCOMMERCE_API_URL &&
  process.env.WOOCOMMERCE_API_KEY &&
  process.env.WOOCOMMERCE_API_SECRET
    ? {
        baseUrl: process.env.WOOCOMMERCE_API_URL,
        consumerKey: process.env.WOOCOMMERCE_API_KEY,
        consumerSecret: process.env.WOOCOMMERCE_API_SECRET,
      }
    : null;

function authHeader(config: WooConfig): string {
  const token = Buffer.from(
    `${config.consumerKey}:${config.consumerSecret}`
  ).toString('base64');
  return `Basic ${token}`;
}

function getConfig(config?: Partial<WooConfig>): WooConfig {
  if (config && config.baseUrl && config.consumerKey && config.consumerSecret) {
    return config as WooConfig;
  }
  if (!envConfig) {
    throw new Error('WooCommerce environment variables are not configured');
  }
  return envConfig;
}

async function request<T>(
  endpoint: string,
  config?: Partial<WooConfig>,
  options?: RequestInit
): Promise<T> {
  const cfg = getConfig(config);

  const res = await fetch(`${cfg.baseUrl}/wp-json/wc/v3/${endpoint}`, {
    headers: {
      Authorization: authHeader(cfg),
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`WooCommerce API error: ${res.status}`);
  }

  return res.json();
}

export async function fetchProducts(config?: Partial<WooConfig>): Promise<any[]> {
  return request<any[]>('products', config);
}

export async function fetchOrders(config?: Partial<WooConfig>): Promise<any[]> {
  return request<any[]>('orders', config);
}

export interface OrderItem {
  product_id: number;
  quantity: number;
}

export async function createOrder(
  items: OrderItem[],
  config?: Partial<WooConfig>
): Promise<any> {
  return request<any>('orders', config, {
    method: 'POST',
    body: JSON.stringify({ line_items: items }),
  });
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
