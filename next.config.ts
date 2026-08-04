/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  async rewrites() {
    return [
      {
        source: "/external_chatbot",
        destination: "/external_chatbot.html",
      },
      {
        source: "/internal_chatbot",
        destination: "/internal_chatbot.html",
      },
    ];
  },
};

module.exports = nextConfig;