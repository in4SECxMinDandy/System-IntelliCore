/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'via.placeholder.com', 'picsum.photos'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    NEXT_PUBLIC_ML_URL: process.env.NEXT_PUBLIC_ML_URL || 'http://localhost:8001',
  },
};

module.exports = nextConfig;
