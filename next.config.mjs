/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  // Uncomment to see the workaround fix everything (execCount stays 1,
  // every instanceof check passes):
  // serverExternalPackages: ["lib-l"],
};

export default nextConfig;
