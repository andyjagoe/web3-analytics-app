/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  async redirects() {
    return [
      {
        source: '/apps',
        destination: '/apps/popular',
        permanent: true,
      },
      {
        source: '/queries',
        destination: '/queries/popular',
        permanent: true,
      },
      {
        source: '/dashboards',
        destination: '/dashboards/popular',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
