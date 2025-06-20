# Fulexo

Fulexo is a multi-channel e-commerce management platform built with Next.js and TypeScript. This repository contains the initial project structure with mock data and placeholder integrations.

## Setup

1. Install dependencies and start the development server:
   ```bash
   npm install && npm run dev
   ```

2. Copy `.env.example` to `.env.local` and provide the required environment variables.
   The `.env.local` file is ignored by Git, so your secrets remain private. Use your
   admin account credentials here.

   To enable WooCommerce integration, set your API credentials and store URL in `.env.local`:

 ```env
  WOOCOMMERCE_API_URL=https://yourstore.com
  WOOCOMMERCE_API_KEY=your-key
  WOOCOMMERCE_API_SECRET=your-secret
  ```

   Provide Supabase credentials so profile and store data can persist. If you are
   connecting to a self-managed PostgreSQL instance, also fill in the `POSTGRES_*`
   variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
   SUPABASE_SERVICE_ROLE_KEY=service-role-key
   ```

   Set credentials for the demo authentication:

   ```env
   AUTH_EMAIL=admin@example.com
   AUTH_PASSWORD=changeme
   NEXTAUTH_SECRET=super-secret-key
   ```

## Project Structure

- `src/pages` – Next.js pages
- `src/components` – React components
- `src/lib` – Hooks and integration services
- `src/utils` – Utility functions
- `src/styles` – Global styles (Tailwind CSS)

## Authentication

Access the application at `/login` and sign in with the credentials specified in `AUTH_EMAIL` and `AUTH_PASSWORD`. After logging in you can view and update your profile at `/profile`.

## Deployment

This project is ready to deploy on Vercel. Make sure your environment variables are configured in Vercel dashboard.

## Notes

This is an early scaffold with mock API routes and integration placeholders. Further modules such as real API connections, authentication, and background job handling can be implemented on top of this structure.
