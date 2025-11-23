/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.s3.**.amazonaws.com',
      },
    ],
    // Оптимизация на снимките
    formats: ['image/avif', 'image/webp'],
    // Lazy loading по подразбиране
    loading: 'lazy',
  },
}

module.exports = nextConfig
