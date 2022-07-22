/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: "https://searchmynotion.com",
  generateRobotsTxt: true, // (optional)
  exclude: ["/search"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/search",
      },
    ],
  },
  // ...other options
};
