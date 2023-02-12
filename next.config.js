/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["t.scdn.co", "wrapped-images.spotifycdn.com", "i.scdn.co", "mosaic.scdn.co"],
  }
}

module.exports = nextConfig
