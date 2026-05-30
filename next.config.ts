import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  ...(process.env.NEXT_PUBLIC_NODE_ENV === "prod" && {
    compiler: {
      removeConsole: {
        exclude: ["error"],
      },
    },
  }),
};

export default nextConfig;
