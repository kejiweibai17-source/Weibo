/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    // Vercel Image Optimization 已觸發 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED（402），
    // 暫關閉優化，改由瀏覽器直接載入原圖，避免全站 next/image 變成死圖。
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'inf.fjg.mybluehost.me',
      },
      {
        protocol: 'https',
        hostname: 'd2w53g1q050m78.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'coralclub.ru',
      },
      {
        protocol: 'https',
        hostname: 'ru.coral.club',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com', // WordPress Jetpack CDN
      },
      {
        protocol: 'https',
        hostname: 'i1.wp.com', // WordPress Jetpack CDN
      },
      {
        protocol: 'https',
        hostname: 'i2.wp.com', // WordPress Jetpack CDN
      },
      {
        protocol: 'https',
        hostname: 'takidanifudouson.or.jp',
      },
      {
        protocol: 'https',
        hostname: 'shiroyamakumano-jinja.jp',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'gcm.org.tw', // 🚀 新增這個網域，解決 Invalid src prop 報錯
      }
    ],
  },
};

export default nextConfig;