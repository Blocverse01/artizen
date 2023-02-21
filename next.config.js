/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["user-images.githubusercontent.com", "ipfs.io"],
  },
};

module.exports = nextConfig;
