/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'cdn.discordapp.com',
            port: '',
            pathname: '/avatars/**',
          },
        ],
      },

}

module.exports = nextConfig
