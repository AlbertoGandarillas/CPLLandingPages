/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "hwsrv-1132312.hostwindsdns.com",
      "mappingarticulatedpathways.azurewebsites.net",
    ],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mappingarticulatedpathways.azurewebsites.net",
        pathname: "/Common/images/**",
      },
    ],
  },
};
export default nextConfig;
