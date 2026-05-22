import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@shopify/polaris', '@shopify/app-bridge-react'],
  images: {
    remotePatterns: [
      {protocol: 'https', hostname: 'images.unsplash.com'},
      {protocol: 'https', hostname: 'cdn.shopify.com'},
    ],
  },
};

export default nextConfig;
