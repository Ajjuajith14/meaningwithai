// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // In production, remove all console calls except warn & error
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['warn', 'error'] }
      : false,
  },
};

export default nextConfig;
