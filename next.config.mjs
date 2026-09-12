/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? [
          {
            protocol: "https",
            hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  turbopack: {
    root: import.meta.dirname,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  async headers() {
    return [
      ...["/admin/:path*", "/auth/:path*", "/settings", "/favorites"].map(
        (source) => ({
          source,
          headers: [
            { key: "X-Robots-Tag", value: "noindex, nofollow" },
            { key: "Cache-Control", value: "private, no-store" },
          ],
        }),
      ),
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
