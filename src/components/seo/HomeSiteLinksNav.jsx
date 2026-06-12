import { SITE_PRIMARY_NAV } from "@/lib/seo/config";

/**
 * 首頁語意化導覽（協助 Google 理解 Sitelinks 候選頁面）
 * 視覺隱藏但保留給搜尋引擎與輔助工具讀取
 */
export default function HomeSiteLinksNav() {
  return (
    <nav aria-label="網站主要頁面" className="sr-only">
      <h2>昔馬 SMASMALL 官方網站主要頁面</h2>
      <ul>
        {SITE_PRIMARY_NAV.map((item) => (
          <li key={item.path}>
            <a href={item.path}>{item.name}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
