/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      // {
      //   hostname: "ycgglyhunbrgrbfdjkvh.supabase.co",
      // },
      // {
      //   hostname: "lnitzkhucstqcrbveyhe.supabase.co",
      // },
      {
        protocol: "https",
        hostname: "ezpedal-website-medias.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
