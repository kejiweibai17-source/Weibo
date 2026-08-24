# 私人智財備份（勿交給客戶）

建立日期：2026-08-23  
用途：交付客戶前保留的專業程式碼備份；本資料夾請勿打進客戶 ZIP。

## 已備份並自專案刪除

### `code-snippets/`（WordPress Code Snippets 原始碼）
這些通常已裝在正式站 WP 後台；客戶只要能改內容，不必拿到你的 snippet 原始檔。

| 檔案 | 價值說明 |
|------|----------|
| `smasmall-series-products.php` | 系列商品 CPT／REST／前台資料結構 |
| `smasmall-frontend-revalidate.php` | 內容更新 → 前端 ISR 快取刷新（整合關鍵） |
| `smasmall-product-meta.php` | 產品 meta／欄位 |
| `smasmall-home-*.php` | 首頁各區塊 CMS 資料來源 |
| `smasmall-hero-slider.php` | Hero 輪播資料 |
| `smasmall-retail-stores.php` | 全台門市／GEO 資料 |
| `smasmall-featured-posts.php` | 精選文章 |
| `category-terms-order.php` | 分類排序 |
| `genacct-*.php` | CLS／導覽／效能修復（維運專業） |

## 參考備份（專案內仍保留，交付時建議不要給）

### `next-high-value-reference/seo/`
SEO／GEO／JSON-LD／Sitelinks／sitemap 策略（你的核心專業）

### `next-high-value-reference/wordpress-mappers/`
WP REST → Next.js 資料對應層

---

還原方式：把 `code-snippets/` 整包複製回專案 `wordpress/code-snippets/`。
