const baseUrl = process.env.baseUrl;

module.exports = {
  env: {
    baseUrl: process.env.BASE_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.HOST_NAME,
        port: '',
      },
    ],
  },
};
