/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost", // Allow images from localhost
      "hwsrv-1132312.hostwindsdns.com", // Example external domain
      "mappingarticulatedpathways.azurewebsites.net",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};
export default nextConfig;
