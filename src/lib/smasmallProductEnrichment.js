/**
 * 依產品系列／名稱取得昔馬 SMASMALL 商品文案（優先爬取 PChome 24h，失敗則用內建資料）。
 */

const PCHOME_PRODUCT_URL = {
  Constellation: "https://24h.pchome.com.tw/prod/DMBK4Y-A900JX15J",
  NoseHair: "https://24h.pchome.com.tw/prod/DMBK4Y-A900I8NT7",
  LittleKingKong: "https://24h.pchome.com.tw/prod/DMBK15-A900IZ0HR",
  Youth: "https://24h.pchome.com.tw/prod/DMBK0N-A900BVX9J",
  Gentleman: "https://24h.pchome.com.tw/prod/DMBK4Y-A900ILT6Q",
  DarkKnight: "https://24h.pchome.com.tw/prod/DMBK4Y-A900IUJPO",
};

const WEIBO_SHIPPING =
  "由台灣總代理威柏科技原廠授權銷售。台灣本島約 1–3 個工作天出貨；全館滿 NT$1,500 免運。刮鬍刀屬個人衛生用品，拆封後除瑕疵外恕不退換，請於收貨 7 日內聯繫客服。";

/** 昔馬品牌共通賣點（官網／首頁文案） */
const BRAND_FEATURES = [
  {
    title: "全合金壓鑄機身",
    content:
      "拋棄傳統塑膠，汲取重機與航空機身靈感，打造扎實耐用的全合金機身，握感沉穩、展現復古未來主義品味。",
  },
  {
    title: "磁吸快拆刀頭",
    content:
      "高精密磁吸結構，一秒貼合與拆卸，清潔更省力，亦降低傳統卡榫磨損問題。",
  },
  {
    title: "荷蘭進口精鋼刀片",
    content:
      "雙環超薄刀網與自銳研磨技術，精準捕捉各方向鬍鬚，剃鬚更滑順。",
  },
];

const SERIES_PROFILES = {
  Constellation: {
    shortDesc:
      "昔馬 SMASMALL 星座系列電動刮鬍刀禮盒，水象／風象／土象／火象四款主題，專屬雷雕序號與完整星座禮盒配件，送禮與自用皆宜。",
    highlights: [
      "電池升級至 450mAh，持久續航，擺脫電量焦慮",
      "IPX7 級防水，全機可水洗，可搭配刮鬍泡使用",
      "專屬唯一雷雕序號，享一年保固與售後服務",
    ],
    details: `型號：CQ1
禮盒內容：電動刮鬍刀、收納皮套、Type-C 充電線、清潔毛刷、星座明信片信封組、星座手提袋、星座轉盤卡、說明書
星座系列：火象、土象、風象、水象
電池容量：450mAh｜額定輸入：5V⎓0.5A｜充電接口：Type-C
電機轉速：9100 轉±10%｜機身材質：合金鋼材｜防水等級：IPX7
刀頭設計：磁吸式｜續航約 95 分鐘｜充電約 65 分鐘
產品尺寸：74×31.5×56.5 mm｜重量：223±5 g
保固：12 個月（主機）｜產地：中國（台灣監製）`,
  },
  NoseHair: {
    shortDesc:
      "昔馬 SMASMALL 電動鼻毛修剪器禮盒，圓形刀頭 360° 舒適修剪，Type-C 快充，小巧便攜。",
    highlights: [
      "圓形刀頭 360° 舒適修剪，不傷鼻腔",
      "1 小時快充，日常使用續航約 365 天",
      "Type-C 接口充電，開箱即可使用",
    ],
    details: `型號：M2-IB
標準配備：昔馬電動鼻毛修剪器、清潔毛刷、Type-C 充電線
刀頭材質：合金鋼材｜機身材質：PU 仿真皮
額定輸入：5V⎓200mA｜額定功率：1W｜電池：200mAh
產品淨重：75 g｜尺寸：51×23×54 mm
保固：12 個月（機身）｜產地：中國（台灣監製）`,
  },
  LittleKingKong: {
    shortDesc:
      "昔馬 SMASMALL S3 小金剛旗艦三刀頭電動刮鬍刀，三刀頭浮動貼合，旗艦級全合金機身，適合追求效率與質感的理容需求。",
    highlights: [
      "旗艦三刀頭設計，加大剃鬚面積，效率更高",
      "全合金機身與磁吸刀頭，質感與維護兼具",
      "IPX7 全機防水，支援乾濕兩用與水洗清潔",
    ],
    details: `系列：S3 小金剛旗艦三刀頭
刀頭：三刀頭浮動式｜機身：全合金壓鑄
防水等級：IPX7｜充電：Type-C
保固：12 個月（主機，依原廠規範）
產地：中國（台灣監製）
※ 詳細規格請參閱盒內說明書或洽威柏科技客服。`,
  },
  Youth: {
    shortDesc:
      "昔馬 SMASMALL 青春版電動刮鬍刀精緻禮盒，月光銀／幻影黑／元素灰三色可選，輕巧好握、完整禮盒配件。",
    highlights: [
      "IPX7 級防水性能",
      "雙環開放式圓刀＋獨立浮動刀網",
      "1 小時快速充電",
    ],
    details: `顏色：月光銀、元素灰、幻影黑
包裝內容：S1 刮鬍刀、皮套、毛刷、充電線、說明書
產品尺寸：5.5×3×7.3 cm｜包裝尺寸：11.5×8.1×18.5 cm
本產品屬個人衛生用品，拆封後除瑕疵外恕不退換。`,
  },
  Gentleman: {
    shortDesc:
      "昔馬 SMASMALL 玩美紳士電動刮鬍刀禮盒，刮鬍刀、鼻毛刀與收納蛋三合一，送禮體驗一次到位。",
    highlights: [
      "三合一禮盒：電動刮鬍刀＋鼻毛修剪器＋收納蛋",
      "IPX7 全機防水，乾濕兩用",
      "全合金機身與磁吸刀頭，質感與便利並重",
    ],
    details: `系列：玩美紳士 Gentleman
禮盒內容：依款式圖示（主機、鼻毛刀、收納蛋、充電線、清潔配件等）
保固：12 個月（主機，依原廠規範）｜台灣總代理：威柏科技`,
  },
  DarkKnight: {
    shortDesc:
      "昔馬 SMASMALL 黑夜騎士電動刮鬍刀禮盒，傳奇灰配色、硬派質感，完整禮盒配件適合送禮。",
    highlights: [
      "黑夜騎士專屬配色與禮盒包裝",
      "IPX7 防水，全機可水洗",
      "磁吸刀頭＋全合金機身，旅行與日常皆宜",
    ],
    details: `系列：黑夜騎士 Dark Knight
禮盒內容：依款式圖示（主機、配件、說明書等）
保固：12 個月（主機，依原廠規範）｜台灣總代理：威柏科技`,
  },
  Defender: {
    shortDesc:
      "昔馬 SMASMALL 捍衛者+ 全合金電動刮鬍刀，戰損塗裝、雙環開放式刀頭與磁吸快拆，展現硬派理容風格。",
    highlights: [
      "全合金戰損塗裝機身，硬派質感",
      "雙環開放式浮動圓刀頭＋荷蘭精鋼刀片",
      "1 小時快充，長效續航；IPX7 全機防水",
    ],
    details: `系列：捍衛者 Defender+
特色：磁吸快拆、全合金機身、IPX7 防水
保固：12 個月（主機，依原廠規範）｜台灣總代理：威柏科技`,
  },
};

const cache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60 * 12;

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** 從 PChome 頁面純文字擷取賣點與規格 */
export function parsePchomePlainText(text) {
  const highlights = [];
  const bulletRe = /[-－•]\s*([^\n•]{8,120})/g;
  let m;
  while ((m = bulletRe.exec(text)) !== null) {
    const line = m[1].trim();
    if (
      line.includes("P幣") ||
      line.includes("登記") ||
      line.includes("折價") ||
      line.startsWith("Type-C接口充電，可立即使用")
    ) {
      continue;
    }
    if (/防水|續航|充電|刀頭|保固|雷雕|快充|修剪|合金|三刀|磁吸|IPX7|mAh/i.test(line)) {
      if (!highlights.includes(line)) highlights.push(line);
    }
  }

  let specs = "";
  const specMatch = text.match(
    /規格說明\s*([\s\S]*?)(?:標準配備|## 相關分類|購物須知|單模式|類型\s*\|)/,
  );
  if (specMatch) {
    specs = specMatch[1]
      .replace(/[•・]/g, "\n")
      .replace(/\s*•\s*/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  const taglineMatch = text.match(
    /複製連結\s*([\s\S]{0,80}?)\s*#\s*/,
  );
  const tagline = taglineMatch?.[1]?.replace(/\s+/g, " ").trim() ?? "";

  return { highlights: highlights.slice(0, 5), specs, tagline };
}

function buildFeatures(highlights, profile) {
  const fromHighlights = (highlights.length ? highlights : profile.highlights).map(
    (content, i) => ({
      title: i === 0 ? "產品亮點" : `特色 ${i + 1}`,
      content,
    }),
  );

  if (fromHighlights.length === 1 && fromHighlights[0].title === "產品亮點") {
    return fromHighlights;
  }

  return fromHighlights.length >= 2
    ? fromHighlights
    : profile.highlights.map((content, i) => ({
        title: i === 0 ? "產品亮點" : `特色 ${i + 1}`,
        content,
      }));
}

async function fetchPchomeParsed(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; WeiboTech/1.0; +https://www.weiboltd.com)",
      Accept: "text/html,application/xhtml+xml",
    },
    next: { revalidate: 43200 },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const plain = stripHtml(html);
  return parsePchomePlainText(plain);
}

/**
 * @param {{ seriesKey: string, title: string }} params
 * @returns {Promise<{ shortDesc: string, features: {title:string,content:string}[], details: string, shipping: string, source: string }>}
 */
export async function enrichSmasmallProductInfo({ seriesKey, title }) {
  const cacheKey = `${seriesKey}::${title}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return hit.data;
  }

  const profile = SERIES_PROFILES[seriesKey] ?? {
    shortDesc: `昔馬 SMASMALL ${title}，由台灣總代理威柏科技原廠授權。`,
    highlights: BRAND_FEATURES.map((f) => f.content),
    details: `商品：${title}\n品牌：SMASMALL 昔馬\n總代理：威柏科技`,
  };

  let highlights = [...profile.highlights];
  let details = profile.details;
  let shortDesc = profile.shortDesc;
  let source = "curated";

  const pchomeUrl = PCHOME_PRODUCT_URL[seriesKey];
  if (pchomeUrl) {
    try {
      const parsed = await fetchPchomeParsed(pchomeUrl);
      if (parsed) {
        if (parsed.highlights.length) {
          highlights = parsed.highlights;
          source = "pchome";
        }
        if (parsed.specs) {
          details = parsed.specs
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
            .join("\n");
          source = "pchome";
        }
        if (parsed.tagline && parsed.tagline.length > 4 && parsed.tagline.length < 60) {
          shortDesc = `昔馬 SMASMALL ${title}。${parsed.tagline}`;
        }
      }
    } catch {
      /* 使用 curated */
    }
  }

  const variant = title?.includes("｜")
    ? title.split("｜").pop()?.trim()
    : null;
  if (variant && variant.length > 0 && !shortDesc.includes(variant)) {
    shortDesc = `${shortDesc}（${variant}）`;
  }

  const features =
    highlights.length >= 2
      ? buildFeatures(highlights, profile)
      : [...buildFeatures(highlights, profile).slice(0, 2), ...BRAND_FEATURES.slice(0, 2)];

  const data = {
    shortDesc,
    features,
    details,
    shipping: WEIBO_SHIPPING,
    source,
  };

  cache.set(cacheKey, { at: Date.now(), data });
  return data;
}
