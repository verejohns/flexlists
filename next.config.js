/** @type {import('next').NextConfig} */
const dotenv = require("dotenv");
dotenv.config();

const nextConfig = {
  // reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, module: false };
    }

    config.experiments = config.experiments || {};
    config.experiments.topLevelAwait = true;

    // config.module.rules.push({
    //   test: /\.js$/,
    //   exclude: /node_modules/,
    //   use: {
    //     loader: 'babel-loader',
    //   },
    // });

    config.module.rules.push({
      test: /\.js$/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
      include(path) {
        if (path.includes("marked")) {
          return true;
        }
        if (path.includes("flexlists-api")) {
          return true;
        }
        if (path.includes("node_modules")) {
          return false;
        }
      },
    });

    return config;
  },
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

// const { withSentryConfig } = require("@sentry/nextjs");

// if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== "nope")
//   module.exports = withSentryConfig(
//     module.exports,
//     {
//       // For all available options, see:
//       // https://github.com/getsentry/sentry-webpack-plugin#options

//       // Suppresses source map uploading logs during build
//       silent: true,

//       org: "appsalad",
//       project: "newv2-frontend",
//     },
//     {
//       // For all available options, see:
//       // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

//       // Upload a larger set of source maps for prettier stack traces (increases build time)
//       widenClientFileUpload: true,

//       // Transpiles SDK to be compatible with IE11 (increases bundle size)
//       transpileClientSDK: true,

//       // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
//       tunnelRoute: "/monitoring",

//       // Hides source maps from generated client bundles
//       hideSourceMaps: true,

//       // Automatically tree-shake Sentry logger statements to reduce bundle size
//       disableLogger: true,
//     }
//   );
