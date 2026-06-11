/**
 * 文章內頁區塊假資料（WordPress 自訂欄位尚未建立時使用）
 * 版型參照 Apple / Meta 產品文章頁
 */
export const ARTICLE_PAGE_FALLBACK = {
  stickyBar: {
    category: "理容知識",
    productLine: "昔馬 SMASMALL",
    priceLabel: "建議售價 NT$2,980 起",
    ctaLabel: "前往選購",
    ctaHref: "/accessories",
  },
  hero: {
    title: "隨時隨地，俐落完成刮鬍",
    description:
      "輕巧全合金機身搭配磁吸刀頭，無論是晨間整理或差旅外出，都能快速完成乾淨修容。",
    footnote: "* 建議搭配原廠 Type-C 充電器（5V/1A 或 5V/2A）。",
    image: "/images/index/banner-01.png",
  },
 
  duoCards: [
    {
      title: "LINE ",
      subtitle: "產品諮詢、保固與售後，一對一即時回覆",
      image: "/images/b91b5cc9-729c-4f89-a75e-fe43576c1762-2.png",
      primaryCta: {
        label: "加入好友",
        href: "https://page.line.me/157yqtwl?oat_content=url&openQrModal=true",
      },
      secondaryCta: {
        label: "立即諮詢",
        href: "https://page.line.me/157yqtwl?oat_content=url&openQrModal=true",
      },
    },
    {
      title: "Facebook",
      subtitle: "追蹤最新產品消息、活動資訊與理容知識",
      image: "/images/index/banner-04.png",
      primaryCta: {
        label: "追蹤我們",
        href: "https://www.facebook.com/249wzrtv/",
      },
      secondaryCta: {
        label: "查看最新動態",
        href: "https://www.facebook.com/249wzrtv/",
      },
    },
  ],
  trioFeatures: [
    {
      title: "Type-C 快速充電",
      description:
        "支援 Type-C 充電，充飽約需 1 小時；3 分鐘閃充可應急使用，出差旅行更安心。",
      image: "/images/type-c-快速充電.png",
      link: { label: "了解更多", href: "/support/manuals" },
    },
    {
      title: "隱私與安全",
      description:
        "IPX7 全機防水，刀頭可拆下清洗。建議充電前確認機身乾燥，並使用 BSMI 認證充電器。",
      image: "/images/003-01.png",
    },
    {
      title: "輕巧便攜",
      description:
        "掌心大小的全合金機身，輕鬆放入盥洗包或公事包，是商務與旅行場景的理想配件。",
      image: "/images/002.png",
      link: { label: "了解更多", href: "/about" },
    },
  ],
  faq: {
    title: "常見問題",
    items: [
      {
        question: "昔馬電動刮鬍刀有哪些特色？",
        answer:
          "昔馬 SMASMALL 採用全合金壓鑄機身、磁吸快拆刀頭、荷蘭進口精鋼刀網與 IPX7 防水設計，並支援 Type-C 充電，兼顧質感、便利與耐用性。",
      },
      {
        question: "可以乾濕兩用嗎？",
        answer:
          "支援 IPX7 全機防水，可乾剃也可搭配刮鬍泡濕剃。使用後建議拆下刀頭清洗並完全晾乾。",
      },
      {
        question: "充電需要注意什麼？",
        answer:
          "請使用 5V/1A 或 5V/2A 充電器，勿使用 9V、20V 快充頭。充電前請關閉電源並確認機身乾燥。",
      },
      {
        question: "在台灣購買有保固嗎？",
        answer:
          "透過威柏科技授權通路購買的主機，享有 12 個月原廠保固與售後服務，詳見保固條款頁面。",
      },
    ],
  },
  newsletter: {
    title: "訂閱昔馬最新產品資訊與理容指南",
    placeholder: "請輸入電子郵件",
    buttonLabel: "訂閱",
    disclaimer:
      "訂閱即表示您同意接收昔馬 SMASMALL 相關電子報。我們將依隱私權政策處理您的個人資料，您可隨時取消訂閱。",
  },
};

export type ArticlePageData = typeof ARTICLE_PAGE_FALLBACK & {
  wpTitle?: string;
  wpExcerpt?: string;
  wpBodyHtml?: string;
  featuredImage?: string;
  slug?: string;
  date?: string;
};
