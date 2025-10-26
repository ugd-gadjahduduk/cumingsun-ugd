/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    domains: ['dl.polyhaven.org'],
  },
  webpack: (config) => {
    // Handle Three.js and other modules
    config.externals = config.externals || [];
    config.externals.push({
      canvas: 'canvas',
    });
    
    // Handle SVG imports as React components (for webpack fallback)
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
}
