import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  ...(isProd && {
    compiler: {
      removeConsole: {
        exclude: ["error"],
      },
    },
  }),
};

export default withSentryConfig(nextConfig, {
  org: "yapp-7o",
  project: "frontend",
  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Pass the auth token
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Upload a larger set of source maps for prettier stack traces
  widenClientFileUpload: true,
  tunnelRoute: "/sentry-tunnel",
});
