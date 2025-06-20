/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// Validate environment variables during build/start
try {
  require('./src/utils/validateEnv').validateEnv();
} catch (err) {
  console.error(err);
  process.exit(1);
}

module.exports = nextConfig;
