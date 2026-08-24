import { Link } from "next-view-transitions";
import {
  SITE_PRIMARY_NAV,
  SITE_SITELINKS_NAV,
} from "@/lib/seo/config";

/**
 * 首頁可見快速連結（協助 Google 理解 Sitelinks 候選頁）
 * @deprecated 首頁大區塊已移除；可見 Sitelinks／GEO NAP 改由 Footer 承接，
 * JSON-LD（buildHomePageSchemas）仍輸出 sitelinks + LocalBusiness。
 * 保留此元件以備需要時復用，目前首頁不再掛載。
 */
export default function HomeSiteLinksNav({ seriesItems = [] }) {
  const sitelinkPaths = new Set(SITE_SITELINKS_NAV.map((i) => i.path));
  const secondaryNav = SITE_PRIMARY_NAV.filter(
    (item) => !sitelinkPaths.has(item.path),
  ).slice(0, 5);

  const seriesLinks = Array.isArray(seriesItems)
    ? seriesItems.slice(0, 6).map((item) => ({
        name: item.label || item.title,
        path:
          typeof item.href === "string" && item.href.startsWith("/")
            ? item.href
            : `/series/${encodeURIComponent(item.slug)}`,
      }))
    : [];

  return (
    <section
      className="border-t border-[#e8e8ed] bg-[#f5f5f7]"
      aria-labelledby="home-sitelinks-heading"
      data-sitelinks-nav
    >
      <div className="mx-auto max-w-[1200px] px-5 py-14 md:px-8 md:py-16">
        <h2
          id="home-sitelinks-heading"
          className="text-[22px] font-semibold tracking-tight text-[#1d1d1f] md:text-[28px]"
          data-seo-speakable
        >
          探索昔馬 SMASMALL
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#6e6e73] md:text-[15px]">
          系列商品、產品列表、品牌介紹、理容知識與全台門市，快速前往官方服務頁面。
        </p>

        <nav
          aria-label="網站主要頁面"
          className="mt-8"
          itemScope
          itemType="https://schema.org/SiteNavigationElement"
        >
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {SITE_SITELINKS_NAV.map((item) => (
              <li key={`sitelink-${item.path}`}>
                <Link
                  href={item.path}
                  title={item.description || item.name}
                  itemProp="url"
                  className="group flex h-full flex-col rounded-2xl bg-white px-4 py-4 transition-colors hover:bg-[#ebebed] md:px-5 md:py-5"
                >
                  <span
                    itemProp="name"
                    className="text-[15px] font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] md:text-[16px]"
                  >
                    {item.name}
                  </span>
                  {item.description ? (
                    <span className="mt-1 text-[12px] leading-snug text-[#86868b] md:text-[13px]">
                      {item.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {seriesLinks.length > 0 ? (
          <div className="mt-10">
            <h3 className="text-[13px] font-medium tracking-wide text-[#86868b]">
              熱門系列
            </h3>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {seriesLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="text-[14px] font-medium text-[#1d1d1f] underline-offset-4 hover:text-[#0071e3] hover:underline"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {secondaryNav.length > 0 ? (
          <div className="mt-8 border-t border-[#d2d2d7] pt-6">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {secondaryNav.map((item) => (
                <li key={`nav-${item.path}`}>
                  <Link
                    href={item.path}
                    className="text-[13px] text-[#6e6e73] underline-offset-4 hover:text-[#1d1d1f] hover:underline"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
