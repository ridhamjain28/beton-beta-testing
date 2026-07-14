/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/light-simulation-992x',
  distDir: '../src/light-simulation-992x',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
