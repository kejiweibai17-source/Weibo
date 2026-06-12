import { ACCESSORY_SERIES, resolveSeriesImages } from "@/data/accessories";
import {
  SEO_CONFIG,
  SITE_PRIMARY_NAV,
  absoluteUrl,
  entityIds,
  getSiteUrl,
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
      url: absoluteUrl(siteUrl, organization.logoPath),
    },
    image: absoluteUrl(siteUrl, SEO_CONFIG.defaultOgImage),
    description: organization.description,
    email: organization.email,
    telephone: organization.telephone,
    address: postalAddress,
    contactPoint,
    brand: { "@id": ids.brand },
    sameAs,
  };

  const localBusinessNode = {
    "@type": "Store",
    "@id": ids.localBusiness,
    name: `${organization.name}｜${brand.name}台灣總代理`,
    description: organization.description,
    url: siteUrl,
    telephone: organization.telephone,
    email: organization.email,
    image: absoluteUrl(siteUrl, SEO_CONFIG.defaultOgImage),
    priceRange: "$$",
    currenciesAccepted: "TWD",
    paymentAccepted: "Cash, Credit Card, Line Pay",
    address: postalAddress,
    geo: geoCoordinates,
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${geo.addressRegion}${geo.addressLocality}${geo.streetAddress}`,
    )}`,
    openingHoursSpecification,
    areaServed: {
      "@type": "Country",
      name: "Taiwan",
    },
    parentOrganization: { "@id": ids.organization },
    brand: { "@id": ids.brand },
    sameAs,
  };

  const brandNode = {
    "@type": "Brand",
    "@id": ids.brand,
    name: brand.name,
    alternateName: brand.alternateName,
    logo: absoluteUrl(siteUrl, brand.logoPath),
    description: brand.description,
  };

  const websiteNode = {
    "@type": "WebSite",
    "@id": ids.website,
    url: siteUrl,
    name: SEO_CONFIG.siteName,
    alternateName: SEO_CONFIG.siteAlternateName,
    description: brand.description,
    inLanguage: SEO_CONFIG.inLanguage,
    publisher: { "@id": ids.organization },
    copyrightHolder: { "@id": ids.organization },
    about: { "@id": ids.brand },
    image: absoluteUrl(siteUrl, "/images/og-1.jpg"),
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

/** 建立 SiteNavigationElement + ItemList 節點（嵌入 @graph 用） */
export function buildSiteNavigationNodes(siteUrl = getSiteUrl()) {
  const ids = entityIds(siteUrl);

  const navigationElements = SITE_PRIMARY_NAV.map((item, index) => ({
    "@type": "SiteNavigationElement",
    "@id": `${siteUrl}/#nav${item.path.replace(/\//g, "-") || "-home"}`,
    name: item.name,
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

  return { navigationList, navigationElements };
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
    name: "昔馬 SMASMALL 配件與禮盒",
    description:
      "探索昔馬 SMASMALL 電動刮鬍刀禮盒、替換刀頭、收納配件與理容周邊。由威柏科技台灣總代理。",
    inLanguage: SEO_CONFIG.inLanguage,
    isPartOf: { "@id": ids.website },
    about: { "@id": ids.brand },
    publisher: { "@id": ids.organization },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${collectionUrl}#itemlist`,
      name: "昔馬 SMASMALL 配件商品列表",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.title,
        url: `${siteUrl}/accessories/${product.id}`,
        item: { "@id": `${siteUrl}/accessories/${product.id}#product` },
      })),
    },
  };

  const breadcrumb = buildBreadcrumbList(siteUrl, [
    { name: "首頁", path: "/" },
    { name: "配件專區", path: "/accessories" },
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
          text: "可透過威柏科技官方網站與授權通路選購，台灣本島由總代理提供原廠保固與售後服務。",
        },
      },
      {
        "@type": "Question",
        name: "配件是否適用所有昔馬刮鬍刀？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "各配件頁面標示適用系列（如青春版、捍衛者、星座系列等），購買前請確認 Product compatibility 篩選條件。",
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
    ],
  };
}

/** 配件詳情頁：ItemPage + Product + Breadcrumb + 核心實體 */
export function buildAccessoryDetailSchemas(item, siteUrl = getSiteUrl()) {
  if (!item) return [buildCoreEntityGraph(siteUrl)];

  const ids = entityIds(siteUrl);
  const pageUrl = `${siteUrl}/accessories/${item.id}`;
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
    category: item.category,
    manufacturer: { "@id": ids.brand },
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

  if (detail.rating) {
    productNode.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(detail.rating),
      reviewCount: String(detail.reviews ?? 1),
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
  };

  const breadcrumb = buildBreadcrumbList(siteUrl, [
    { name: "首頁", path: "/" },
    { name: "配件專區", path: "/accessories" },
    { name: item.title, path: `/accessories/${item.id}` },
  ]);

  const featureList =
    detail.features?.map((f) => `${f.title}：${f.content}`).join(" ") ?? "";

  const additionalProperty = [];
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

/** 首頁擴充：單一 @graph 整合 WebSite / WebPage / 導覽 / FAQ（Sitelinks 訊號） */
export function buildHomePageSchemas({
  siteUrl = getSiteUrl(),
  faqs = [],
} = {}) {
  const ids = entityIds(siteUrl);
  const core = buildCoreEntityGraph(siteUrl);
  const { navigationList, navigationElements } = buildSiteNavigationNodes(siteUrl);

  const navUrls = SITE_PRIMARY_NAV.map((item) =>
    absoluteUrl(siteUrl, item.path),
  );

  const homepageTitle =
    "昔馬 SMASMALL 電動刮鬍刀禮盒｜送禮首選・原廠保固 - 威柏 WEIBO";
  const homepageDescription =
    "讓每天的儀容成為一種講究。昔馬 SMASMALL 全機鋅合金電動刮鬍刀，森田愛用、2024 網路熱門刮鬍刀領導品牌，多款禮盒附質感包裝，送禮自用皆宜，享原廠 12 個月保固。";

  const webPage = {
    "@type": "WebPage",
    "@id": `${siteUrl}/#webpage`,
    url: siteUrl,
    name: homepageTitle,
    description: homepageDescription,
    inLanguage: SEO_CONFIG.inLanguage,
    isPartOf: { "@id": ids.website },
    about: { "@id": ids.brand },
    publisher: { "@id": ids.organization },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(siteUrl, "/images/og-1.jpg"),
      width: 1200,
      height: 630,
    },
    relatedLink: navUrls,
    significantLink: navigationElements.map((el) => ({ "@id": el["@id"] })),
  };

  const enhancedGraph = core["@graph"].map((node) => {
    if (node["@type"] === "WebSite") {
      return {
        ...node,
        mainEntity: { "@id": `${siteUrl}/#webpage` },
        hasPart: { "@id": ids.siteNavigation },
      };
    }
    return node;
  });

  const graph = [
    ...enhancedGraph,
    navigationList,
    ...navigationElements,
    webPage,
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
  }

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": graph,
  };
}

/** 支援頁 WebPage / FAQPage 結構化資料 */
export function buildSupportWebPageSchema({
  siteUrl = getSiteUrl(),
  path,
  name,
  description,
  pageType = "WebPage",
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
    isPartOf: { "@id": ids.website },
    about: { "@id": ids.brand },
    publisher: { "@id": ids.organization },
  };
}

/** FAQ 頁 mainEntity 結構化資料 */
export function buildFaqPageSchema(faqs, pageUrl, pageId) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "FAQPage",
    "@id": pageId ?? `${pageUrl}#faq`,
    url: pageUrl,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** 保固政策結構化資料 */
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
      "凡透過台灣授權通路購買的 SMASMALL 昔馬主機，享有 12 個月原廠保固，由威柏科技台灣總代理提供售後服務。",
    durationOfWarranty: {
      "@type": "QuantitativeValue",
      value: 12,
      unitCode: "MON",
    },
    warrantyScope: "https://schema.org/RepairOrReplace",
    seller: { "@id": ids.organization },
  };
}
