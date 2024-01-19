/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
const Dotenv = require("dotenv-webpack");

module.exports = {
  // ... other webpack configurations
  plugins: [new Dotenv()],
};

module.exports = nextConfig;
