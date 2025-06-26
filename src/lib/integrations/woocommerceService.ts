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
  const merged: Partial<WooConfig> = {
    ...(envConfig ?? {}),
    ...(config ?? {}),
  };

  if (!merged.baseUrl) {
    throw new Error('Missing WooCommerce configuration: baseUrl');
  }
  if (!merged.consumerKey) {
    throw new Error('Missing WooCommerce configuration: consumerKey');
  }
  if (!merged.consumerSecret) {
    throw new Error('Missing WooCommerce configuration: consumerSecret');
  }

  return merged as WooConfig;
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

async function fetchAll(
  endpoint: string,
  config?: Partial<WooConfig>
): Promise<any[]> {
  const perPage = 100;
  let page = 1;
  let results: any[] = [];
  while (true) {
    const items = await request<any[]>(
      `${endpoint}?per_page=${perPage}&page=${page}`,
      config
    );
    results = results.concat(items);
    if (items.length < perPage) break;
    page += 1;
  }
  return results;
}

export async function fetchProducts(config?: Partial<WooConfig>): Promise<any[]> {
  return fetchAll('products', config);
}

export async function fetchProductsPage(
  page: number,
  perPage: number,
  search = '',
  config?: Partial<WooConfig>
): Promise<{ items: any[]; total: number }> {
  const cfg = getConfig(config);
  const res = await fetch(
    `${cfg.baseUrl}/wp-json/wc/v3/products?per_page=${perPage}&page=${page}&search=${encodeURIComponent(search)}`,
    {
      headers: {
        Authorization: authHeader(cfg),
        'Content-Type': 'application/json',
      },
    }
  );
  if (!res.ok) {
    throw new Error(`WooCommerce API error: ${res.status}`);
  }
  const total = Number(res.headers.get('X-WP-Total') || '0');
  const items = await res.json();
  return { items, total };
}

export async function fetchProduct(
  id: number,
  config?: Partial<WooConfig>
): Promise<any> {
  return request<any>(`products/${id}`, config);
}

export async function fetchCategories(
  config?: Partial<WooConfig>
): Promise<any[]> {
  return fetchAll('products/categories', config);
}

export async function fetchOrders(config?: Partial<WooConfig>): Promise<any[]> {
  return fetchAll('orders', config);
}

export async function fetchOrder(
  id: number,
  config?: Partial<WooConfig>
): Promise<any> {
  return request<any>(`orders/${id}`, config);
}

export interface OrderItem {
  product_id: number;
  quantity: number;
}

export interface CustomerInfo {
  first_name: string;
  last_name: string;
  company?: string;
  country?: string;
  address_1: string;
  address_2?: string;
  postcode?: string;
  city: string;
  phone?: string;
  email: string;
}

export async function createOrder(
  items: OrderItem[],
  customer?: CustomerInfo,
  note?: string,
  config?: Partial<WooConfig>
): Promise<any> {
  return request<any>('orders', config, {
    method: 'POST',
    body: JSON.stringify({
      line_items: items,
      ...(customer ? { billing: customer, shipping: customer } : {}),
      ...(note ? { customer_note: note } : {}),
    }),
  });
}

export async function syncStock() {
  // Example placeholder with retry logic
  const maxRetries = 3;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Placeholder implementation
      return;
    } catch (error) {
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error('Failed to sync stock');
}

export async function updateOrderStatus() {
  // Placeholder for updating order status
  return;
}

export async function fetchShippingMethods(
  config?: Partial<WooConfig>
): Promise<any[]> {
  return fetchAll('shipping_methods', config);
}

export async function fetchOrderNotes(
  id: number,
  config?: Partial<WooConfig>
): Promise<any[]> {
  return request<any[]>(`orders/${id}/notes`, config);
}

export async function updateOrder(
  id: number,
  data: any,
  config?: Partial<WooConfig>
): Promise<any> {
  return request<any>(`orders/${id}`, config, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export interface TrackingEntry {
  id: string;
  provider: string;
  tracking_number: string;
  date_shipped: string;
}

export async function fetchTrackingEntries(
  id: number,
  config?: Partial<WooConfig>
): Promise<TrackingEntry[]> {
  const order = await fetchOrder(id, config);
  const meta = order.meta_data?.find((m: any) => m.key === 'tracking_info')?.value;
  if (!meta) return [];
  try {
    return JSON.parse(meta) as TrackingEntry[];
  } catch {
    return [];
  }
}

async function saveTrackingEntries(
  id: number,
  entries: TrackingEntry[],
  config?: Partial<WooConfig>
) {
  await updateOrder(
    id,
    { meta_data: [{ key: 'tracking_info', value: JSON.stringify(entries) }] },
    config
  );
}

export async function addTrackingEntry(
  id: number,
  entry: TrackingEntry,
  markCompleted: boolean,
  config?: Partial<WooConfig>
) {
  const entries = await fetchTrackingEntries(id, config);
  const updated = [...entries, entry];
  const data: any = {
    meta_data: [{ key: 'tracking_info', value: JSON.stringify(updated) }],
  };
  if (markCompleted) data.status = 'completed';
  await updateOrder(id, data, config);
}

export async function deleteTrackingEntry(
  id: number,
  entryId: string,
  config?: Partial<WooConfig>
) {
  const entries = await fetchTrackingEntries(id, config);
  const updated = entries.filter((e) => e.id !== entryId);
  await saveTrackingEntries(id, updated, config);
}

export async function sendOrderEmail(
  id: number,
  template: string,
  config?: Partial<WooConfig>
) {
  // Placeholder implementation. A real integration would call a WooCommerce
  // extension endpoint to send the email.
  await updateOrder(id, { meta_data: [{ key: 'last_email_sent', value: template }] }, config);
}
