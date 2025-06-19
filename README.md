# Fulexo

Fulexo is a multi-channel e-commerce management platform built with Next.js and TypeScript. This repository contains the initial project structure with mock data and placeholder integrations.

## Setup

1. Install dependencies and start the development server:
   ```bash
   npm install && npm run dev
   ```

2. Copy `.env.example` to `.env.local` and provide the required environment variables.

   To enable WooCommerce integration, set your API credentials and store URL in `.env.local`:

   ```env
   WOOCOMMERCE_API_URL=https://yourstore.com
   WOOCOMMERCE_API_KEY=your-key
   WOOCOMMERCE_API_SECRET=your-secret
   ```

## Project Structure

- `src/pages` – Next.js pages
- `src/components` – React components
- `src/lib` – Hooks and integration services
- `src/utils` – Utility functions
- `src/styles` – Global styles (Tailwind CSS)

## Deployment

This project is ready to deploy on Vercel. Make sure your environment variables are configured in Vercel dashboard.

## Notes

This is an early scaffold with mock API routes and integration placeholders. Further modules such as real API connections, authentication, and background job handling can be implemented on top of this structure.
