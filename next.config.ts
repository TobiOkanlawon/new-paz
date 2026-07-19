// // import type { NextConfig } from "next";

// // const nextConfig: NextConfig = {
// //   /* config options here */
// //   experimental: {
// //     turbo: {
// //       rules: {
// //         "*.svg": {
// //           loaders: ["@svgr/webpack"],
// //           as: "*.js",
// //         },
// //       },
// //     },
// //   },
// // };

// // export default nextConfig;
// import type { NextConfig } from "next";
// import path from "path";

// const nextConfig: NextConfig = {
//   webpack(config) {
//     config.resolve.alias["@"] = path.resolve(__dirname, "src");

//     config.module.rules.push({
//       test: /\.svg$/,
//       use: ["@svgr/webpack"],
//     });

//     return config;
//   },
//   turbopack: {},
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // 1. Find the existing rule that handles SVGs and exclude it
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.svg')
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // 2. Add your new SVGR rule
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  // Configuration for Turbopack (Next 15+)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Configure allowed image domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
  },

  // Server Actions default to a 1MB body limit; loan/profile document uploads
  // allow files up to 5MB, so raise the ceiling to accommodate multipart overhead.
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
