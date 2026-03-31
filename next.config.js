/** @type {import('next').NextConfig} */

const PHP_API_FILES = [
  "classic-movies.php",
  "story-movies.php",
  "songs.php",
  "hollywood.php",
  "kid-words.php",
];

const nextConfig = {
  output: "export",
  reactStrictMode: false,
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
  nextConfig.rewrites = async function rewrites() {
    const target = process.env.BACKEND_PROXY_TARGET;
    if (!target || String(target).trim() === "") {
      return [];
    }
    const base = String(target).replace(/\/$/, "");
    return PHP_API_FILES.map((file) => ({
      source: `/${file}`,
      destination: `${base}/${file}`,
    }));
  };
}

module.exports = nextConfig;
