import type { NextConfig } from "next";

/** Not track-metrics.php: dev sessions would be recorded as production traffic. */
const PHP_API_FILES = [
  "classic-movies.php",
  "story-movies.php",
  "songs.php",
  "hollywood.php",
  "kid-words.php",
];

const nextConfig: NextConfig = {
  output: "export",
  devIndicators: false,
  /** Stops `next dev` from writing a boilerplate AGENTS.md into the repo. */
  agentRules: false,
  /** Emit `game/classic/index.html` so static hosts (S3, etc.) do not 403 on `/game/classic`. */
  trailingSlash: true,
  reactStrictMode: true,
  reactCompiler: true,
  typedRoutes: true,
  images: {
    unoptimized: true,
  },
  /** Inlines route CSS into HTML to cut a render-blocking request (helps mobile LCP). */
  experimental: {
    inlineCss: true,
  },
};

/**
 * Only attach rewrites during `next dev`. `output: export` builds ignore rewrites
 * and Next warns if rewrites exist in config; production export has no Node proxy anyway.
 */
if (process.env.NODE_ENV === "development") {
  nextConfig.rewrites = async () => {
    const target = process.env.BACKEND_PROXY_TARGET?.trim();
    if (!target) {
      return [];
    }
    const base = target.replace(/\/$/, "");
    return PHP_API_FILES.map((file) => ({
      source: `/${file}`,
      destination: `${base}/${file}`,
    }));
  };
}

export default nextConfig;
