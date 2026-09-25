/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      }
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/,
      resourceQuery: /raw/,
      type: 'asset/source',
    });
    config.module.rules.push({
      test: /\.html$/,
      resourceQuery: { not: [/raw/] },
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
