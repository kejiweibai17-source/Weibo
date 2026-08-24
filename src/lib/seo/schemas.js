/** 精簡版 schema（維護合約另提供進階 SEO 設定） */
import { absoluteUrl, entityIds, getSiteUrl, SEO_CONFIG } from "./config";

export function buildCoreEntityGraph(siteUrl = getSiteUrl()) {
  const ids = entityIds(siteUrl);
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": ids.website, url: siteUrl, name: SEO_CONFIG.siteName },
      { "@type": "Organization", "@id": ids.organization, name: SEO_CONFIG.organization.name },
    ],
  };
}

export function buildSiteNameSchema(siteUrl = getSiteUrl()) {
  return { "@context": "https://schema.org", "@type": "WebSite", name: SEO_CONFIG.siteName, url: siteUrl };
}

export function buildBreadcrumbList(siteUrl, items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: (items || []).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(siteUrl, item.path),
    })),
  };
}

const emptyGraph = () => ({ "@context": "https://schema.org", "@graph": [] });
const emptyList = () => [];

export function buildHomePageSchemas(_opts = {}) {
  return emptyGraph();
}
export function buildSiteNavigationNodes() {
  return { navigationList: {}, navigationElements: [], sitelinksList: {}, sitelinksElements: [] };
}
export function buildSiteNavigationSchema(_siteUrl) {
  return emptyGraph();
}
export function buildAccessoriesCollectionSchemas(_products, _siteUrl) {
  return emptyGraph();
}
export function buildAccessoryDetailSchemas(_item, _siteUrl) {
  return emptyGraph();
}
export function buildSupportWebPageSchema(opts = {}) {
  return { "@context": "https://schema.org", "@type": "WebPage", name: opts.name || "", url: opts.path || "" };
}
export function buildFaqPageSchema() {
  return emptyGraph();
}
export function buildWarrantyPolicySchema() {
  return emptyGraph();
}
export function buildWarrantyServiceSchema() {
  return emptyGraph();
}
export function buildCareGuideHowToSchemas() {
  return emptyList();
}
export function buildWarrantyHowToSchema() {
  return emptyGraph();
}
export function buildPoliciesPageSchemas(_sections, _siteUrl) {
  return emptyList();
}
export function buildSupportCollectionSchema() {
  return emptyGraph();
}
export function buildSeriesHubSchemas(_seriesItems, _siteUrl) {
  return emptyList();
}
export function buildSeriesPageSchemas(_page, _siteUrl) {
  return emptyList();
}
