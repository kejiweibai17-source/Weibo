import { ACCESSORY_SERIES, resolveSeriesImages } from "@/data/accessories";
import {
  absoluteUrl,
  entityIds,
  getSiteUrl,
  ogImageUrl,
  SEO_CONFIG,
  SITE_PRIMARY_NAV,
  SITE_SITELINKS_NAV,
} from "@/lib/seo/config";

const SCHEMA_CONTEXT = "https://schema.org";

/** 核心實體：WebSite、Organization、LocalBusiness（含 Geo）、Brand */
export function buildCoreEntityGraph(siteUrl = getSiteUrl()) {
  const ids = entityIds(siteUrl);
  const { organization, brand, geo, openingHours, sameAs } = SEO_CONFIG;
  const orgUrl = organization.url.replace(/\/$/, "");

  const postalAddress = {
    "@type": "PostalAddress",
    streetAddress: geo.streetAddress,
    addressLocality: geo.addressLocality,
    addressRegion: geo.addressRegion,
    postalCode: geo.postalCode,
    addressCountry: geo.addressCountry,
  };

  const geoCoordinates = {
    "@type": "GeoCoordinates",
    latitude: geo.latitude,
    longitude: geo.longitude,
  };

  const openingHoursSpecification = openingHours.map((slot) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: slot.dayOfWeek,
    opens: slot.opens,
    closes: slot.closes,
  }));

  const contactPoint = {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: organization.telephone,
    email: organization.email,
    areaServed: SEO_CONFIG.areaServed,
    availableLanguage: [SEO_CONFIG.inLanguage, "en"],
  };

  const organizationNode = {
    "@type": "Organization",
    "@id": ids.organization,
    name: organization.name,
    alternateName: organization.alternateName,
    url: orgUrl,
    logo: {
      "@type": "ImageObject",
      "@id": `${siteUrl}/#organization-logo`,
      url: absoluteUrl(siteUrl, organization.logoPath),
      contentUrl: absoluteUrl(siteUrl, organization.logoPath),
      width: 512,
      height: 512,
      caption: organization.name,
    },
    image: absoluteUrl(siteUrl, SEO_CONFIG.defaultOgImage),
    description: organization.description,
    email: organization.email,
    telephone: organization.telephone,
    faxNumber: organization.fax,
    address: postalAddress,
    contactPoint: [
      contactPoint,
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: organization.telephone,
        email: organization.email,
        areaServed: SEO_CONFIG.areaServed,
        availableLanguage: [SEO_CONFIG.inLanguage, "en"],
      },
    ],
    brand: { "@id": ids.brand },
    sameAs,
    areaServed: {
      "@type": "Country",
      name: "Taiwan",
      identifier: "TW",
    },
    knowsAbout: [
      "電動刮鬍刀",
      "男士理容",
      "合金工藝",
      "磁吸刀頭",
      "IPX7防水",
      "SMASMALL",
    ],
  };

  const localBusinessNode = {
    "@type": ["Store", "LocalBusiness"],
    "@id": ids.localBusiness,
    name: `${organization.name}｜${brand.name}台灣總代理`,
    alternateName: ["昔馬台灣總代理", "威柏科技太保營運據點"],
    description: organization.description,
    url: siteUrl,
    telephone: organization.telephone,
    email: organization.email,
    image: [
      absoluteUrl(siteUrl, SEO_CONFIG.defaultOgImage),
      absoluteUrl(siteUrl, brand.logoPath),
    ],
    priceRange: "$$",
    currenciesAccepted: "TWD",
    paymentAccepted: "Cash, Credit Card, Line Pay, Bank Transfer",
    address: postalAddress,
    geo: geoCoordinates,
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${geo.addressRegion}${geo.addressLocality}${geo.streetAddress}`,
    )}`,
    openingHoursSpecification,
    areaServed: [
      {
        "@type": "Country",
        name: "Taiwan",
        identifier: "TW",
      },
      {
        "@type": "AdministrativeArea",
        name: geo.addressRegion,
      },
      {
        "@type": "City",
        name: geo.addressLocality,
      },
    ],
    parentOrganization: { "@id": ids.organization },
    brand: { "@id": ids.brand },
    sameAs,
    isAccessibleForFree: true,
  };

  const brandNode = {
    "@type": "Brand",
    "@id": ids.brand,
    name: brand.name,
    alternateName: brand.alternateName,
    logo: absoluteUrl(siteUrl, brand.logoPath),
    description: brand.description,
    url: siteUrl,
    slogan: "讓每天的儀容成為一種講究",
    sameAs,
  };

  const websiteNode = {
    "@type": "WebSite",
    "@id": ids.website,
    // 與 canonical 首頁一致（含結尾 /），利於 Google Site Name
    url: `${siteUrl}/`,
    name: SEO_CONFIG.siteName,
    alternateName: SEO_CONFIG.siteAlternateName,
    description: brand.description,
    inLanguage: SEO_CONFIG.inLanguage,
    publisher: { "@id": ids.organization },
    copyrightHolder: { "@id": ids.organization },
    about: { "@id": ids.brand },
    /** 搜尋結果站點圖示：用符合 Google 規範的正方形 192px icon */
    thumbnailUrl: absoluteUrl(siteUrl, "/icon-192.png"),
    image: absoluteUrl(siteUrl, "/icon-192.png"),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/accessories?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [websiteNode, organizationNode, localBusinessNode, brandNode],
  };
}

/**
 * Google Site Name 專用標記（官方建議放在首頁）
 * name = 搜尋結果 favicon 旁顯示的網站名稱
 */
export function buildSiteNameSchema(siteUrl = getSiteUrl()) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: SEO_CONFIG.siteName,
    alternateName: SEO_CONFIG.siteAlternateName,
    url: `${siteUrl}/`,
    inLanguage: SEO_CONFIG.inLanguage,
    publisher: {
      "@type": "Organization",
      name: SEO_CONFIG.organization.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteUrl, SEO_CONFIG.brand.logoPath),
      },
    },
  };
}

/** 建立 SiteNavigationElement + ItemList 節點（嵌入 @graph 用） */
export function buildSiteNavigationNodes(siteUrl = getSiteUrl()) {
  const ids = entityIds(siteUrl);

  const navigationElements = SITE_PRIMARY_NAV.map((item, index) => ({
    "@type": "SiteNavigationElement",
    "@id": `${siteUrl}/#nav${item.path.replace(/\//g, "-") || "-home"}`,
    name: item.name,
    description: item.description || undefined,
    url: absoluteUrl(siteUrl, item.path),
    isPartOf: { "@id": ids.website },
    position: index + 1,
  }));

  const navigationList = {
    "@type": "ItemList",
    "@id": ids.siteNavigation,
    name: "SMASMALL 昔馬 主要導覽",
    description: "昔馬 SMASMALL 官方網站主要頁面連結",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: navigationElements.length,
    itemListElement: navigationElements.map((element, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: element.name,
      url: element.url,
      item: { "@id": element["@id"] },
    })),
  };

  /** 專給 Google Sitelinks 的精簡 ItemList（短名稱、高權重頁） */
  const sitelinksElements = SITE_SITELINKS_NAV.map((item, index) => ({
    "@type": "SiteNavigationElement",
    "@id": `${siteUrl}/#sitelink${item.path.replace(/\//g, "-")}`,
    name: item.name,
    description: item.description,
    url: absoluteUrl(siteUrl, item.path),
    isPartOf: { "@id": ids.website },
    position: index + 1,
  }));

  const sitelinksList = {
    "@type": "ItemList",
    "@id": `${siteUrl}/#sitelinks`,
    name: "SMASMALL 昔馬 網站快速連結",
    description:
      "官方網站主要服務入口：系列商品、產品列表、品牌介紹、文章、門市、支援與聯絡",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: sitelinksElements.length,
    itemListElement: sitelinksElements.map((element, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: element.name,
      description: element.description,
      url: element.url,
      item: absoluteUrl(siteUrl, SITE_SITELINKS_NAV[index].path),
    })),
  };

  return {
    navigationList,
    navigationElements,
    sitelinksList,
    sitelinksElements,
  };
}

/** 首頁主要導覽（SiteNavigationElement + ItemList，協助搜尋引擎理解站內重要頁面） */
export function buildSiteNavigationSchema(siteUrl = getSiteUrl()) {
  const { navigationList, navigationElements } = buildSiteNavigationNodes(siteUrl);

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [navigationList, ...navigationElements],
  };
}

export function buildBreadcrumbList(siteUrl, items) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(siteUrl, item.path),
    })),
  };
}

function accessorySeriesLabel(seriesKey) {
  return ACCESSORY_SERIES[seriesKey]?.label ?? seriesKey;
}

/** 配件列表頁：CollectionPage + ItemList + Product 節點 */
export function buildAccessoriesCollectionSchemas(products, siteUrl = getSiteUrl()) {
  const ids = entityIds(siteUrl);
  const collectionUrl = `${siteUrl}/accessories`;
  const core = buildCoreEntityGraph(siteUrl);

  const productNodes = products.map((product) => {
    const productUrl = `${siteUrl}/accessories/${product.id}`;
    const image = product.images?.[0]
      ? absoluteUrl(siteUrl, product.images[0])
      : absoluteUrl(siteUrl, SEO_CONFIG.defaultOgImage);

    return {
      "@type": "Product",
      "@id": `${productUrl}#product`,
      name: product.title,
      description: `昔馬 SMASMALL ${accessorySeriesLabel(product.series)} — ${product.title}。台灣總代理威柏科技原廠授權。`,
      image: [image],
      url: productUrl,
      sku: product.id,
      brand: { "@id": ids.brand },
      category: product.category,
      offers: {
        "@type": "Offer",
        url: productUrl,
        availability: `${SCHEMA_CONTEXT}/InStock`,
        itemCondition: `${SCHEMA_CONTEXT}/NewCondition`,
        priceCurrency: "TWD",
        ...(product.price ? { price: String(product.price) } : {}),
        priceValidUntil: new Date(
          Date.now() + 90 * 24 * 60 * 60 * 1000,
        ).toISOString().slice(0, 10),
        seller: { "@id": ids.organization },
        availableAtOrFrom: { "@id": ids.localBusiness },
        areaServed: SEO_CONFIG.areaServed,
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "TW",
          returnPolicyCategory:
            "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: "7",
          returnMethod: "https://schema.org/ReturnByMail",
          returnFees: "https://schema.org/FreeReturn",
        },
      },
    };
  });

  const collectionPage = {
    "@context": SCHEMA_CONTEXT,
    "@type": "CollectionPage",
    "@id": `${collectionUrl}#webpage`,
    url: collectionUrl,
    name: "昔馬 SMASMALL 產品列表｜鋅合金電動刮鬍刀・鼻毛修剪器",
    description:
      "昔馬 SMASMALL 全系列電動刮鬍刀禮盒、替換刀頭、收納配件與理容周邊。台灣總代理威柏科技（嘉義縣太保市）原廠授權，享 12 個月保固。",
    inLanguage: SEO_CONFIG.inLanguage,
    isPartOf: { "@id": ids.website },
    about: [{ "@id": ids.brand }, { "@id": ids.localBusiness }],
    publisher: { "@id": ids.organization },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(siteUrl, ogImageUrl("/images/og-2.jpg")),
      width: 1200,
      height: 630,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "[data-seo-speakable]"],
    },
    spatialCoverage: {
      "@type": "Country",
      name: "Taiwan",
    },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${collectionUrl}#itemlist`,
      name: "昔馬 SMASMALL 產品列表",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.title,
        url: `${siteUrl}/accessories/${product.id}`,
        item: { "@id": `${siteUrl}/accessories/${product.id}#product` },
      })),
    },
    significantLink: [
      absoluteUrl(siteUrl, "/series"),
      absoluteUrl(siteUrl, "/support"),
      absoluteUrl(siteUrl, "/contact"),
    ],
  };

  const breadcrumb = buildBreadcrumbList(siteUrl, [
    { name: "首頁", path: "/" },
    { name: "產品列表", path: "/accessories" },
  ]);

  const faq = buildAccessoriesFaqSchema(siteUrl);

  return [
    core,
    collectionPage,
    ...productNodes,
    breadcrumb,
    faq,
  ];
}

function buildAccessoriesFaqSchema(siteUrl) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "FAQPage",
    "@id": `${siteUrl}/accessories#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "昔馬 SMASMALL 配件在哪裡購買？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "可透過威柏科技官方網站「產品列表」與授權通路選購，台灣本島由總代理提供原廠保固與售後服務。營運據點位於嘉義縣太保市。",
        },
      },
      {
        "@type": "Question",
        name: "配件是否適用所有昔馬刮鬍刀？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "各商品頁面標示適用系列（如青春版、捍衛者、星座系列等），購買前請確認產品相容性篩選條件，或先至「系列商品」了解各產品線。",
        },
      },
      {
        "@type": "Question",
        name: "威柏科技客服據點在哪裡？",
        acceptedAnswer: {
          "@type": "Answer",
          text: `營運據點位於${SEO_CONFIG.geo.addressRegion}${SEO_CONFIG.geo.addressLocality}${SEO_CONFIG.geo.streetAddress}，客服專線 ${SEO_CONFIG.organization.telephone}，服務時間週一至週五 09:00–18:00。`,
        },
      },
      {
        "@type": "Question",
        name: "系列商品與產品列表有什麼不同？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "「系列商品」以產品線介紹規格與故事；「產品列表」可一次瀏覽、篩選並選購全系列商品與配件。",
        },
      },
    ],
  };
}

/** 配件詳情頁：ItemPage + Product + Breadcrumb + 核心實體 */
export function buildAccessoryDetailSchemas(item, siteUrl = getSiteUrl()) {
  if (!item) return [buildCoreEntityGraph(siteUrl)];

  const ids = entityIds(siteUrl);
  const pageUrl = `${siteUrl}/accessories/${encodeURIComponent(item.id)}`;
  const core = buildCoreEntityGraph(siteUrl);

  const images = resolveSeriesImages(
    item.series,
    item.detail?.imageFiles ?? item.imageFiles ?? [],
  ).map((src) => absoluteUrl(siteUrl, src));
  const primaryImage =
    images[0] ?? absoluteUrl(siteUrl, SEO_CONFIG.defaultOgImage);

  const detail = item.detail ?? {};
  const description =
    detail.shortDesc ??
    `昔馬 SMASMALL ${accessorySeriesLabel(item.series)} — ${item.title}。`;

  const productNode = {
    "@context": SCHEMA_CONTEXT,
    "@type": "Product",
    "@id": `${pageUrl}#product`,
    name: item.title,
    description,
    image: images.length ? images : [primaryImage],
    url: pageUrl,
    sku: item.id,
    mpn: item.id,
    brand: { "@id": ids.brand },
    category: item.category || accessorySeriesLabel(item.series),
    manufacturer: { "@id": ids.brand },
    areaServed: SEO_CONFIG.areaServed,
    offers: {
      "@type": "Offer",
      url: pageUrl,
      availability: `${SCHEMA_CONTEXT}/InStock`,
      itemCondition: `${SCHEMA_CONTEXT}/NewCondition`,
      priceCurrency: "TWD",
      ...(item.detail?.price ? { price: String(item.detail.price) } : {}),
      priceValidUntil: new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000,
      ).toISOString().slice(0, 10),
      seller: { "@id": ids.organization },
      availableAtOrFrom: { "@id": ids.localBusiness },
      areaServed: SEO_CONFIG.areaServed,
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "TW",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: "7",
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: SEO_CONFIG.areaServed,
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
        },
      },
    },
  };

  // 僅在有真實評價數時輸出，Google 才可能顯示搜尋結果星等
  const reviewCount = Number(detail.reviews);
  if (detail.rating != null && Number(detail.rating) > 0 && reviewCount > 0) {
    productNode.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(detail.rating),
      reviewCount: String(reviewCount),
      bestRating: "5",
      worstRating: "1",
    };
  }

  const itemPage = {
    "@context": SCHEMA_CONTEXT,
    "@type": "ItemPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: item.title,
    description,
    inLanguage: SEO_CONFIG.inLanguage,
    isPartOf: { "@id": ids.website },
    about: { "@id": `${pageUrl}#product` },
    mainEntity: { "@id": `${pageUrl}#product` },
    publisher: { "@id": ids.organization },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "[data-seo-speakable]"],
    },
    spatialCoverage: {
      "@type": "Country",
      name: "Taiwan",
    },
  };

  const breadcrumb = buildBreadcrumbList(siteUrl, [
    { name: "首頁", path: "/" },
    { name: "產品列表", path: "/accessories" },
    { name: item.title, path: `/accessories/${item.id}` },
  ]);

  const featureList =
    detail.features?.map((f) => `${f.title}：${f.content}`).join(" ") ?? "";

  const additionalProperty = [];
  if (item.series) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "適用系列",
      value: accessorySeriesLabel(item.series),
    });
  }
  if (featureList) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "產品特色",
      value: featureList,
    });
  }
  if (detail.details) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "規格與細節",
      value: detail.details,
    });
  }
  if (additionalProperty.length) {
    productNode.additionalProperty = additionalProperty;
  }

  return [core, itemPage, productNode, breadcrumb];
}

/** 首頁擴充：單一 @graph 整合 WebSite / WebPage / 導覽 / FAQ（Sitelinks + GEO） */
export function buildHomePageSchemas({
  siteUrl = getSiteUrl(),
  faqs = [],
  seriesLinks = [],
} = {}) {
  const ids = entityIds(siteUrl);
  const core = buildCoreEntityGraph(siteUrl);
  const {
    navigationList,
    navigationElements,
    sitelinksList,
    sitelinksElements,
  } = buildSiteNavigationNodes(siteUrl);

  const sitelinkUrls = SITE_SITELINKS_NAV.map((item) =>
    absoluteUrl(siteUrl, item.path),
  );
  const navUrls = SITE_PRIMARY_NAV.map((item) =>
    absoluteUrl(siteUrl, item.path),
  );

  const seriesLinkUrls = (Array.isArray(seriesLinks) ? seriesLinks : [])
    .slice(0, 8)
    .map((item) => {
      if (typeof item?.href === "string" && item.href.startsWith("http")) {
        return item.href;
      }
      if (typeof item?.href === "string" && item.href.startsWith("/")) {
        return absoluteUrl(siteUrl, item.href);
      }
      if (item?.slug) {
        return absoluteUrl(siteUrl, `/series/${encodeURIComponent(item.slug)}`);
      }
      return null;
    })
    .filter(Boolean);

  const homepageTitle =
    "昔馬 SMASMALL 電動刮鬍刀禮盒｜送禮首選・原廠保固 - 威柏 WEIBO";
  const homepageDescription =
    "讓每天的儀容成為一種講究。昔馬 SMASMALL 全機鋅合金電動刮鬍刀，森田愛用、2024 網路熱門刮鬍刀領導品牌，多款禮盒附質感包裝，送禮自用皆宜，享原廠 12 個月保固。台灣總代理威柏科技，營運據點嘉義縣太保市。";

  const webPage = {
    "@type": ["WebPage", "CollectionPage"],
    "@id": `${siteUrl}/#webpage`,
    url: siteUrl,
    name: homepageTitle,
    headline: homepageTitle,
    description: homepageDescription,
    inLanguage: SEO_CONFIG.inLanguage,
    isPartOf: { "@id": ids.website },
    about: [{ "@id": ids.brand }, { "@id": ids.localBusiness }],
    mentions: [
      { "@id": ids.brand },
      { "@id": ids.organization },
      { "@id": ids.localBusiness },
    ],
    publisher: { "@id": ids.organization },
    author: { "@id": ids.organization },
    copyrightHolder: { "@id": ids.organization },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(siteUrl, ogImageUrl("/images/og-1.jpg")),
      width: 1200,
      height: 630,
      caption: "SMASMALL 昔馬全合金電動刮鬍刀",
    },
    image: absoluteUrl(siteUrl, ogImageUrl("/images/og-1.jpg")),
    dateModified: new Date().toISOString().slice(0, 10),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "[data-seo-speakable]", "[data-sitelinks-nav]"],
    },
    spatialCoverage: {
      "@type": "Country",
      name: "Taiwan",
      identifier: "TW",
    },
    contentLocation: {
      "@type": "Place",
      name: `${SEO_CONFIG.geo.addressRegion}${SEO_CONFIG.geo.addressLocality}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: SEO_CONFIG.geo.addressLocality,
        addressRegion: SEO_CONFIG.geo.addressRegion,
        addressCountry: "TW",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: SEO_CONFIG.geo.latitude,
        longitude: SEO_CONFIG.geo.longitude,
      },
    },
    relatedLink: [...new Set([...sitelinkUrls, ...navUrls, ...seriesLinkUrls])],
    significantLink: [
      ...sitelinkUrls,
      ...sitelinksElements.map((el) => ({ "@id": el["@id"] })),
    ],
    hasPart: [
      { "@id": `${siteUrl}/#sitelinks` },
      { "@id": ids.siteNavigation },
    ],
    mainContentOfPage: {
      "@type": "WebPageElement",
      cssSelector: "[data-seo-speakable], main, h1",
    },
  };

  const breadcrumb = buildBreadcrumbList(siteUrl, [
    { name: "首頁", path: "/" },
  ]);

  const enhancedGraph = core["@graph"].map((node) => {
    if (node["@type"] === "WebSite") {
      return {
        ...node,
        mainEntity: { "@id": `${siteUrl}/#webpage` },
        hasPart: [
          { "@id": `${siteUrl}/#sitelinks` },
          { "@id": ids.siteNavigation },
        ],
      };
    }
    return node;
  });

  const graph = [
    ...enhancedGraph,
    sitelinksList,
    ...sitelinksElements,
    navigationList,
    ...navigationElements,
    webPage,
    breadcrumb,
  ];

  if (faqs.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      isPartOf: { "@id": ids.website },
      mainEntityOfPage: { "@id": `${siteUrl}/#webpage` },
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
    webPage.mainEntity = [{ "@id": `${siteUrl}/#faq` }, { "@id": `${siteUrl}/#sitelinks` }];
  } else {
    webPage.mainEntity = { "@id": `${siteUrl}/#sitelinks` };
  }

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": graph,
  };
}

/** 支援頁 WebPage 基礎（含 GEO Speakable） */
export function buildSupportWebPageSchema({
  siteUrl = getSiteUrl(),
  path,
  name,
  description,
  pageType = "WebPage",
  dateModified = "2026-06-01",
  imagePath = SEO_CONFIG.defaultOgImage,
  speakableCssSelectors = ["h1", "h2", "article p", ".faq-answer"],
  extra = {},
}) {
  const ids = entityIds(siteUrl);
  const url = absoluteUrl(siteUrl, path);

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": pageType,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: SEO_CONFIG.inLanguage,
    dateModified,
    isPartOf: { "@id": ids.website },
    about: { "@id": ids.brand },
    publisher: { "@id": ids.organization },
    author: { "@id": ids.organization },
    copyrightHolder: { "@id": ids.organization },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(siteUrl, ogImageUrl(imagePath)),
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: speakableCssSelectors,
    },
    ...extra,
  };
}

/** FAQ 頁：FAQPage + Question/Answer（Google 官方 FAQ 結構化資料） */
export function buildFaqPageSchema(faqs, pageUrl, pageId) {
  const siteUrl = getSiteUrl();
  const ids = entityIds(siteUrl);

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "FAQPage",
    "@id": pageId ?? `${pageUrl}#faq`,
    url: pageUrl,
    inLanguage: SEO_CONFIG.inLanguage,
    isPartOf: { "@id": ids.website },
    about: { "@id": ids.brand },
    mainEntity: faqs.map((faq, index) => ({
      "@type": "Question",
      "@id": `${pageUrl}#q-${index + 1}`,
      name: faq.question,
      position: index + 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** 保固政策：WarrantyPromise */
export function buildWarrantyPolicySchema(siteUrl = getSiteUrl()) {
  const ids = entityIds(siteUrl);
  const warrantyUrl = `${siteUrl}/support/warranty`;

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "WarrantyPromise",
    "@id": `${warrantyUrl}#warranty`,
    url: warrantyUrl,
    name: "SMASMALL 昔馬 12 個月原廠保固",
    description:
      "凡透過台灣授權通路購買的 SMASMALL 昔馬主機，享有 12 個月原廠保固，由威柏科技台灣總代理提供售後服務。保固以購買憑證為準，無需額外線上註冊。",
    durationOfWarranty: {
      "@type": "QuantitativeValue",
      value: 12,
      unitCode: "MON",
    },
    warrantyScope: "https://schema.org/WarrantyScope",
    seller: { "@id": ids.organization },
  };
}

/** 保固售後服務 Service */
export function buildWarrantyServiceSchema(siteUrl = getSiteUrl()) {
  const ids = entityIds(siteUrl);
  const warrantyUrl = `${siteUrl}/support/warranty`;

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Service",
    "@id": `${warrantyUrl}#service`,
    name: "SMASMALL 昔馬原廠保固與售後服務",
    description:
      "威柏科技台灣總代理提供 12 個月原廠保固、瑕疵退換貨與維修換貨協助。",
    serviceType: "Product warranty and after-sales support",
    provider: { "@id": ids.organization },
    brand: { "@id": ids.brand },
    areaServed: {
      "@type": "Country",
      name: "Taiwan",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: warrantyUrl,
      servicePhone: {
        "@type": "ContactPoint",
        telephone: SEO_CONFIG.organization.telephone,
        contactType: "customer service",
        email: SEO_CONFIG.organization.email,
        areaServed: SEO_CONFIG.areaServed,
        availableLanguage: [SEO_CONFIG.inLanguage, "en"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          opens: "09:00",
          closes: "18:00",
        },
      },
    },
  };
}

/**
 * HowTo：保養指南各章節
 * @param {Array<{ id: string, title: string, summary: string, steps: string[] }>} sections
 */
export function buildCareGuideHowToSchemas(
  sections,
  siteUrl = getSiteUrl(),
) {
  const manualsUrl = `${siteUrl}/support/manuals`;

  return sections.map((section, index) => ({
    "@context": SCHEMA_CONTEXT,
    "@type": "HowTo",
    "@id": `${manualsUrl}#howto-${section.id}`,
    url: `${manualsUrl}#section-${section.id}`,
    name: `STEP ${String(index + 1).padStart(2, "0")} ${section.title}`,
    description: section.summary,
    inLanguage: SEO_CONFIG.inLanguage,
    totalTime: "PT5M",
    tool: [
      {
        "@type": "HowToTool",
        name: "清水、軟布、附贈清潔刷",
      },
    ],
    step: section.steps.map((text, stepIndex) => ({
      "@type": "HowToStep",
      position: stepIndex + 1,
      name: `步驟 ${stepIndex + 1}`,
      text,
      url: `${manualsUrl}#section-${section.id}`,
    })),
  }));
}

/** HowTo：保固申請流程 */
export function buildWarrantyHowToSchema(steps, siteUrl = getSiteUrl()) {
  const warrantyUrl = `${siteUrl}/support/warranty`;

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "HowTo",
    "@id": `${warrantyUrl}#howto-apply`,
    url: warrantyUrl,
    name: "SMASMALL 昔馬保固申請流程",
    description:
      "保留購買憑證、記錄產品序號、聯繫威柏科技客服、寄送維修或換貨。",
    inLanguage: SEO_CONFIG.inLanguage,
    totalTime: "PT15M",
    step: steps.map((step) => ({
      "@type": "HowToStep",
      position: Number(step.step),
      name: `STEP ${step.step} ${step.title}`,
      text: String(step.description).replace(/\*\*/g, ""),
      url: `${warrantyUrl}#step-${step.step}`,
    })),
  };
}

/**
 * 政策頁：TermsOfService / PrivacyPolicy / ItemList
 * @param {Array<{ id: string, title: string, summary: string, paragraphs: string[] }>} sections
 */
export function buildPoliciesPageSchemas(
  sections,
  siteUrl = getSiteUrl(),
) {
  const ids = entityIds(siteUrl);
  const policiesUrl = `${siteUrl}/support/policies`;

  const typeById = {
    terms: "TermsOfService",
    privacy: "PrivacyPolicy",
    shipping: "WebPage",
    fraud: "WebPage",
  };

  const partNodes = sections.map((section) => {
    const text = section.paragraphs.join("\n\n");
    return {
      "@context": SCHEMA_CONTEXT,
      "@type": typeById[section.id] || "WebPageElement",
      "@id": `${policiesUrl}#${section.id}`,
      url: `${policiesUrl}#${section.id}`,
      name: section.title,
      description: section.summary,
      inLanguage: SEO_CONFIG.inLanguage,
      dateModified: "2026-06-01",
      isPartOf: { "@id": `${policiesUrl}#webpage` },
      about: { "@id": ids.brand },
      publisher: { "@id": ids.organization },
      text,
    };
  });

  const itemList = {
    "@context": SCHEMA_CONTEXT,
    "@type": "ItemList",
    "@id": `${policiesUrl}#policy-list`,
    name: "使用條款與政策目錄",
    numberOfItems: sections.length,
    itemListElement: sections.map((section, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: section.title,
      url: `${policiesUrl}#${section.id}`,
      item: { "@id": `${policiesUrl}#${section.id}` },
    })),
  };

  return [...partNodes, itemList];
}

/** 客戶支援中心 CollectionPage + ItemList */
export function buildSupportCollectionSchema(siteUrl = getSiteUrl()) {
  const ids = entityIds(siteUrl);
  const supportUrl = `${siteUrl}/support`;
  const pages = [
    {
      name: "常見問題 FAQ",
      path: "/support/faq",
      description: "產品、購買、保固與保養常見問答",
    },
    {
      name: "使用與保養指南",
      path: "/support/manuals",
      description: "日常清潔、刀頭保養、防水與收納充電",
    },
    {
      name: "產品保固與註冊",
      path: "/support/warranty",
      description: "12 個月原廠保固與申請流程",
    },
    {
      name: "使用條款與政策",
      path: "/support/policies",
      description: "服務條款、隱私權、運送退換貨與防詐騙",
    },
  ];

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "CollectionPage",
    "@id": `${supportUrl}#webpage`,
    url: supportUrl,
    name: "SMASMALL 昔馬客戶支援中心",
    description:
      "昔馬 SMASMALL 客戶支援：常見問題、保養指南、產品保固與使用條款政策。",
    inLanguage: SEO_CONFIG.inLanguage,
    isPartOf: { "@id": ids.website },
    about: { "@id": ids.brand },
    publisher: { "@id": ids.organization },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${supportUrl}#support-list`,
      numberOfItems: pages.length,
      itemListElement: pages.map((page, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: page.name,
        description: page.description,
        url: absoluteUrl(siteUrl, page.path),
        item: absoluteUrl(siteUrl, page.path),
      })),
    },
  };
}

/** 系列商品總覽 CollectionPage（/series） */
export function buildSeriesHubSchemas(seriesItems = [], siteUrl = getSiteUrl()) {
  const ids = entityIds(siteUrl);
  const hubUrl = `${siteUrl}/series`;
  const core = buildCoreEntityGraph(siteUrl);

  const collectionPage = {
    "@context": SCHEMA_CONTEXT,
    "@type": "CollectionPage",
    "@id": `${hubUrl}#webpage`,
    url: hubUrl,
    name: "昔馬 SMASMALL 系列商品｜鋅合金電動刮鬍刀系列總覽",
    description:
      "瀏覽昔馬 SMASMALL 全系列商品：星座系列、捍衛者、黑夜騎士、青春版、小金剛與理容配件。台灣總代理威柏科技原廠授權。",
    inLanguage: SEO_CONFIG.inLanguage,
    isPartOf: { "@id": ids.website },
    about: [{ "@id": ids.brand }, { "@id": ids.localBusiness }],
    publisher: { "@id": ids.organization },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "[data-seo-speakable]"],
    },
    spatialCoverage: {
      "@type": "Country",
      name: "Taiwan",
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(siteUrl, ogImageUrl("/images/og-1.jpg")),
      width: 1200,
      height: 630,
    },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${hubUrl}#itemlist`,
      name: "昔馬 SMASMALL 系列商品列表",
      numberOfItems: seriesItems.length,
      itemListElement: seriesItems.map((item, index) => {
        const path =
          typeof item.href === "string" && item.href.startsWith("/")
            ? item.href
            : `/series/${encodeURIComponent(item.slug)}`;
        return {
          "@type": "ListItem",
          position: index + 1,
          name: item.label || item.title,
          url: absoluteUrl(siteUrl, path),
          item: absoluteUrl(siteUrl, path),
        };
      }),
    },
    significantLink: [
      absoluteUrl(siteUrl, "/accessories"),
      absoluteUrl(siteUrl, "/brand"),
      absoluteUrl(siteUrl, "/support"),
    ],
  };

  const breadcrumb = buildBreadcrumbList(siteUrl, [
    { name: "首頁", path: "/" },
    { name: "系列商品", path: "/series" },
  ]);

  return [core, collectionPage, breadcrumb];
}

function extractSeriesShowcaseItems(page) {
  const items = [];
  for (const block of page?.blocks || []) {
    if (block?.type === "product_showcase" && Array.isArray(block.items)) {
      items.push(...block.items);
    }
  }
  return items;
}

/** 單一系列頁：CollectionPage / Product + Breadcrumb + 核心實體 + Speakable */
export function buildSeriesPageSchemas(page, siteUrl = getSiteUrl()) {
  if (!page) return [buildCoreEntityGraph(siteUrl)];

  const ids = entityIds(siteUrl);
  const canonical = `/series/${encodeURIComponent(page.slug)}`;
  const pageUrl = absoluteUrl(siteUrl, canonical);
  const core = buildCoreEntityGraph(siteUrl);
  const imageSrc = page.ogImage || page.featuredImage;
  const imageUrl = imageSrc
    ? imageSrc.startsWith("http")
      ? imageSrc
      : absoluteUrl(siteUrl, imageSrc)
    : absoluteUrl(siteUrl, SEO_CONFIG.defaultOgImage);

  const showcaseItems = extractSeriesShowcaseItems(page);

  const productNode = {
    "@type": "Product",
    "@id": `${pageUrl}#product`,
    name: page.title,
    description: page.seoDescription,
    image: [imageUrl],
    url: pageUrl,
    brand: { "@id": ids.brand },
    manufacturer: { "@id": ids.brand },
    category: "電動刮鬍刀系列",
    areaServed: SEO_CONFIG.areaServed,
    ...(page.wcProductId
      ? {
          sku: String(page.wcProductId),
          offers: {
            "@type": "Offer",
            url: absoluteUrl(siteUrl, `/accessories/${page.wcProductId}`),
            availability: `${SCHEMA_CONTEXT}/InStock`,
            itemCondition: `${SCHEMA_CONTEXT}/NewCondition`,
            priceCurrency: "TWD",
            seller: { "@id": ids.organization },
            availableAtOrFrom: { "@id": ids.localBusiness },
            areaServed: SEO_CONFIG.areaServed,
          },
        }
      : {}),
  };

  const collectionPage = {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: page.seoTitle || page.title,
    description: page.seoDescription,
    inLanguage: SEO_CONFIG.inLanguage,
    isPartOf: { "@id": ids.website },
    about: [{ "@id": ids.brand }, { "@id": `${pageUrl}#product` }],
    mainEntity: { "@id": `${pageUrl}#product` },
    publisher: { "@id": ids.organization },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "[data-seo-speakable]"],
    },
    spatialCoverage: {
      "@type": "Country",
      name: "Taiwan",
    },
    ...(page.updatedAt ? { dateModified: page.updatedAt } : {}),
    significantLink: [
      absoluteUrl(siteUrl, "/series"),
      absoluteUrl(siteUrl, "/accessories"),
      absoluteUrl(siteUrl, "/support"),
    ],
  };

  if (showcaseItems.length) {
    collectionPage.hasPart = {
      "@type": "ItemList",
      "@id": `${pageUrl}#showcase`,
      name: `${page.title} 系列亮點`,
      numberOfItems: showcaseItems.length,
      itemListElement: showcaseItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name || item.badge || `亮點 ${index + 1}`,
      })),
    };
  }

  const breadcrumb = buildBreadcrumbList(siteUrl, [
    { name: "首頁", path: "/" },
    { name: "系列商品", path: "/series" },
    { name: page.title, path: canonical },
  ]);

  return [
    {
      "@context": SCHEMA_CONTEXT,
      "@graph": [...core["@graph"], collectionPage, productNode],
    },
    breadcrumb,
  ];
}
