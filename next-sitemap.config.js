/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.smasmall.com.tw',

  // App Router 已有 src/app/robots.ts，不需 next-sitemap 再生成
  generateRobotsTxt: false,

  // App Router 已有 src/app/sitemap.ts，不需 next-sitemap 再生成靜態 sitemap
  generateIndexSitemap: false,

  sitemapSize: 7000,

  exclude: ['/cart', '/checkout', '/account/*', '/api/*'],

  // 動態抓取 WooCommerce 產品路徑（路由為 /accessories/[id]）
  additionalPaths: async () => {
    const paths = [];

    const wpUrl = process.env.WC_API_BASE;
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    if (!wpUrl || !consumerKey || !consumerSecret) {
      console.warn("⚠️ [next-sitemap] 缺少 WooCommerce 環境變數，商品內頁不加入 sitemap。");
      return paths;
    }

    try {
      const authString = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      const baseUrl = wpUrl.replace(/\/$/, "");

      const res = await fetch(`${baseUrl}/wp-json/wc/v3/products?per_page=100&status=publish`, {
        headers: { Authorization: `Basic ${authString}` },
      });

      if (res.ok) {
        const products = await res.json();
        for (const product of products) {
          paths.push({
            loc: `/accessories/${product.slug}`,
            lastmod: new Date(product.date_modified || new Date()).toISOString(),
            changefreq: 'weekly',
            priority: 0.9,
          });
        }
        console.log(`✅ [next-sitemap] 抓取 ${products.length} 筆商品。`);
      }
    } catch (error) {
      console.error("❌ [next-sitemap] 錯誤:", error);
    }

    return paths;
  },
}
