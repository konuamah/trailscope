/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  // your Next.js configuration options here
};

export default withPWA({
  ...nextConfig,
  dest: 'public',
});
