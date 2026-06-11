/** 部落格外頁假資料（WordPress 尚未建立或文章不足時使用） */

export type BlogMomentItem = {
  image: string;
  href: string;
  title: string;
  subtitle?: string;
  featured?: boolean;
  ctaLabel?: string;
  isMock?: boolean;
};

export const BLOG_PAGE_FALLBACK = {
  moments: {
    title: "理容，貫穿每個日常時刻",
    items: [] as BlogMomentItem[],
  },
  selections: {
    title: "值得細讀的理容好文",
    tabs: [
      { id: "new", label: "最新發布" },
      { id: "popular", label: "最多人讀" },
    ],
  },
  confidence: {
    title: "安心選購昔馬 SMASMALL",
    items: [
      {
        label: "台灣總代理",
        text: "威柏科技官方授權，正品保障。",
        icon: "truck",
      },
      {
        label: "原廠保固",
        text: "主機享有 12 個月原廠保固服務。",
        icon: "shield",
      },
      {
        label: "安全付款",
        text: "支援多元付款方式，交易安全有保障。",
        icon: "card",
      },
      {
        label: "專人客服",
        text: "週一至週五提供產品與售後諮詢。",
        icon: "support",
      },
      {
        label: "會員優惠",
        text: "訂閱電子報，搶先獲得新品與活動資訊。",
        icon: "bag",
      },
      {
        label: "售後支援",
        text: "刀頭更換、充電與清潔教學完整提供。",
        icon: "wrench",
      },
    ],
  },
  mockPosts: [
    {
      id: "mock-1",
      slug: "dry-vs-wet-shave",
      title: "乾剃與濕剃怎麼選？電動刮鬍刀完整指南",
      excerpt:
        "了解乾剃、濕剃的差異，以及昔馬 SMASMALL 如何兼顧兩種使用情境，找到最適合你的修容方式。",
      image: "/images/003-01.png",
      date: "2025-03-15",
      category: "理容知識",
    },
    {
      id: "mock-2",
      slug: "blade-cleaning",
      title: "刀頭清潔與保養：延長刮鬍刀壽命的 5 個步驟",
      excerpt:
        "正確拆洗磁吸刀頭、晾乾與收納，讓刀網維持最佳刮鬍表現，也避免異味與細菌滋生。",
      image: "/images/a547d145-6bc1-4dd4-9653-81ee1945b2b8.png",
      date: "2025-02-20",
      category: "保養教學",
    },
    {
      id: "mock-3",
      slug: "gift-guide",
      title: "送禮指南：星座系列禮盒為什麼適合他？",
      excerpt:
        "全合金質感、IPX7 防水與 Type-C 快充，搭配星座主題包裝，是節日與紀念日的理想禮物。",
      image: "/images/5654d56c-22e5-40d5-814e-d76b00de6c2f.png",
      date: "2025-01-10",
      category: "送禮推薦",
    },
    {
      id: "mock-4",
      slug: "type-c-charging",
      title: "Type-C 快充實測：3 分鐘閃充夠用嗎？",
      excerpt:
        "解析 5V/1A 與 5V/2A 充電差異，以及出差前快速補電的實用技巧與注意事項。",
      image: "/images/type-c-快速充電.png",
      date: "2024-12-05",
      category: "產品亮點",
    },
    {
      id: "mock-5",
      slug: "business-travel",
      title: "商務差旅必備：輕巧刮鬍刀的收納與攜帶",
      excerpt:
        "掌心大小的全合金機身，輕鬆放入盥洗包；搭配防水設計，酒店浴室也能安心使用。",
      image: "/images/002.png",
      date: "2024-11-18",
      category: "生活場景",
    },
  ],
};

export type BlogPostCard = {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category?: string;
  /** 假資料占位，後台新增同名文章後會被真實資料替換 */
  isMock?: boolean;
};

export type BlogListPageData = {
  moments: {
    title: string;
    items: BlogMomentItem[];
  };
  selections: typeof BLOG_PAGE_FALLBACK.selections;
  confidence: typeof BLOG_PAGE_FALLBACK.confidence;
  posts: BlogPostCard[];
  featuredPost: BlogPostCard;
};
