# 客戶交付：建議排除清單（讓你有議價／維運優勢）

打包給客戶時，建議「給能跑的網站／內容後台」，不要給「整包可完全自維運的原始專業層」。

## 絕對不要給

| 項目 | 原因 |
|------|------|
| `_PRIVATE_IP_BACKUP/` | 你的私人備份 |
| `.env.local` / `.env*` | API Key、Webhook Secret、WP 帳密 |
| `.git/` | 完整歷史＝等於給全部過程與舊金鑰痕跡 |
| `node_modules/` | 體積大、無必要（他們可 npm i） |
| `.next/` | 本機建置快取 |
| `【品牌LOGO】*` | 若合約未授權素材轉讓，勿一併交 |

## 強烈建議不要給（有利你後續維護／加價）

| 項目 | 原因 |
|------|------|
| `wordpress/code-snippets/` | **已備份並刪除**。WP 整合、revalidate、系列商品、門市 API 是核心 |
| `src/lib/seo/` | Schema／GEO／Sitelinks／sitemap 策略＝SEO 專業 |
| `src/lib/wordpress/` | WP→前端對應邏輯 |
| `src/lib/*server.ts`（系列、門市、首頁各區塊） | Headless CMS 資料層 |
| `src/app/api/`（若有 revalidate／webhook） | 伺服器端機密流程 |
| `scripts/` | 部署／同步腳本 |
| `allfiles.txt`、內部筆記、agent transcripts | 無客戶用途 |

## 可給（客戶日常營運夠用）

- 正式站網址、WP 後台帳號（權限只要「編輯內容」）
- 操作手冊：如何改首頁區塊、文章、門市、系列商品
- 若合約要求前端原始碼：可給「可建置的 Next 專案」，但拿掉上表 SEO／server／snippets
- 或只給 Vercel／主機部署權，不給 repo

## 更有利的交付方式（推薦）

1. **交付運作中的網站**（網域 + WP 後台 + 簡單操作說明）  
2. **原始碼與進階整合**列為「維護合約／原始碼授權」另議  
3. 本機打包 ZIP 時排除：`_PRIVATE_IP_BACKUP`、`wordpress`、`.env*`、`.git`、`node_modules`、`.next`

### 建議打包指令（在專案上一層執行）

```bash
cd "/Volumes/Sandisk E61/威柏科技"
zip -r "smasmall-client-delivery-$(date +%Y%m%d).zip" "網站" \
  -x "網站/_PRIVATE_IP_BACKUP/*" \
  -x "網站/wordpress/*" \
  -x "網站/.git/*" \
  -x "網站/node_modules/*" \
  -x "網站/.next/*" \
  -x "網站/.env*" \
  -x "網站/**/.DS_Store" \
  -x "網站/【品牌LOGO】*" \
  -x "網站/*.zip"
```

（若合約已承諾完整原始碼，再另開「完整授權版」；日常交付用上面精簡版即可。）
