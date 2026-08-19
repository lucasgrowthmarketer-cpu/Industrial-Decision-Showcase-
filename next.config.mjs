/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { NEXT_PUBLIC_ASSETS_BASE: process.env.NEXT_PUBLIC_ASSETS_BASE ?? "" }
};
export default nextConfig;
