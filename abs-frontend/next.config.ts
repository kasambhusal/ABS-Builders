import type { NextConfig } from "next";

function apiRemotePattern(): {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
  pathname: string;
} {
  try {
    const u = new URL(
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
    );
    const protocol = u.protocol.replace(":", "") as "http" | "https";
    return {
      protocol,
      hostname: u.hostname,
      ...(u.port ? { port: u.port } : {}),
      pathname: "/**",
    };
  } catch {
    return {
      protocol: "http",
      hostname: "localhost",
      port: "4000",
      pathname: "/**",
    };
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [apiRemotePattern()],
  },
};

export default nextConfig;
