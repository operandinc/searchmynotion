/** @type {import('next').NextConfig} */

const { createSecureHeaders } = require("next-secure-headers");

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: createSecureHeaders({
          frameGuard: "deny",
          contentSecurityPolicy: {
            directives: {
              frameAncestors: "none",
            },
          },
        }),
      },
    ];
  },

  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
