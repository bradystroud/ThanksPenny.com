import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  rewrites: async () => [
    {source: '/christmas-card', destination: '/christmas-card/index.html'},
    { source: '/christmas-card/:path*', destination: '/christmas-card/:path*' }, // Allows CSS and other assets
    { source: '/christmas-card/images/:path*', destination: '/christmas-card/images/:path*' }, // Allows CSS and other assets
  ],
};

export default nextConfig;
