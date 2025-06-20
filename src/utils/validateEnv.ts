export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'AUTH_EMAIL',
    'AUTH_PASSWORD',
    'NEXTAUTH_SECRET',
    'WOOCOMMERCE_API_URL',
    'WOOCOMMERCE_API_KEY',
    'WOOCOMMERCE_API_SECRET',
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}
