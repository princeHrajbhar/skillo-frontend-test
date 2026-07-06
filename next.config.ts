// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
       {
        protocol: "https",
        hostname: "www.guvi.in",
      },
       {
        protocol: "https",
        hostname: "logo.clearbit.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
       {
        protocol: "https",
        hostname: "sn.shikshanation.com",
      },
       {
        protocol: "https",
        hostname: "sn.shikshanation.com",
      },
     {
        protocol: 'https',
        hostname: '1000logos.net',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'images.bhaskarassets.com',
      },
      {
        protocol: 'https',
        hostname: '**', // WARNING: This allows images from ANY domain
      },
      // Add more hostnames as needed
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.yourdomain.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
  /* config options here */
};

export default nextConfig;