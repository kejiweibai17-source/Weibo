import {
  SITE_PRIMARY_NAV,
  SITE_SITELINKS_NAV,
} from "@/lib/seo/config";

/**
 * 首頁語意化導覽（協助 Google 理解 Sitelinks 候選頁面）
 * - 第一區：Sitelinks 優先候選（短名稱、與 Navbar 一致）
 * - 第二區：其餘重要頁
 * - 第三區：系列商品深層連結
 * 視覺隱藏但保留給搜尋引擎與輔助工具；文案須與可見導覽一致，勿 cloaking
 */
export default function HomeSiteLinksNav({ seriesItems = [] }) {
  const sitelinkPaths = new Set(SITE_SITELINKS_NAV.map((i) => i.path));
  const secondaryNav = SITE_PRIMARY_NAV.filter(
    (item) => !sitelinkPaths.has(item.path),
  );

  const seriesLinks = Array.isArray(seriesItems)
    ? seriesItems.slice(0, 8).map((item) => ({
        name: item.label || item.title,
        path:
          typeof item.href === "string" && item.href.startsWith("/")
            ? item.href
            : `/series/${encodeURIComponent(item.slug)}`,
      }))
    : [];

  return (
    <nav
      aria-label="網站主要頁面與快速連結"
      className="sr-only"
      data-sitelinks-nav
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <h2 data-seo-speakable>昔馬 SMASMALL 官方網站快速連結</h2>
      <p>
        以下為官方網站主要服務入口，對應 Google 搜尋結果 Sitelinks
        候選頁面。
      </p>
      <ul>
        {SITE_SITELINKS_NAV.map((item) => (
          <li key={`sitelink-${item.path}`}>
            <a href={item.path} title={item.description || item.name}>
              {item.name}
            </a>
            {item.description ? <span> — {item.description}</span> : null}
          </li>
        ))}
      </ul>

      {secondaryNav.length > 0 ? (
        <>
          <h2>更多服務與支援</h2>
          <ul>
            {secondaryNav.map((item) => (
              <li key={`nav-${item.path}`}>
                <a href={item.path} title={item.description || item.name}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {seriesLinks.length > 0 ? (
        <>
          <h2>系列商品</h2>
          <ul>
            {seriesLinks.map((item) => (
              <li key={item.path}>
                <a href={item.path}>{item.name}</a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </nav>
  );
}
