export type RetailStore = {
  id: string;
  name: string;
  brand: string;
  region: "北部" | "中部" | "南部" | "東部" | "離島";
  city: string;
  address: string;
  phone: string;
  hours: string;
  note?: string;
  /** 官方 Google Maps 短網址（若有） */
  mapsUrl?: string;
};

/** 產生 Google Maps 搜尋／導航連結（無官方短網址時使用） */
export function getGoogleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function getStoreMapsUrl(store: RetailStore) {
  return store.mapsUrl ?? getGoogleMapsUrl(store.address);
}

export function getRetailStoreCities(stores: RetailStore[] = RETAIL_STORES) {
  return Array.from(new Set(stores.map((store) => store.city)));
}

export function filterRetailStores(
  stores: RetailStore[],
  { keyword = "", city = "" }: { keyword?: string; city?: string },
) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  return stores.filter((store) => {
    const matchesCity = !city || store.city === city;
    if (!matchesCity) return false;
    if (!normalizedKeyword) return true;

    const haystack = [
      store.name,
      store.brand,
      store.city,
      store.address,
      store.phone,
      store.hours,
      store.note ?? "",
      store.region,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedKeyword);
  });
}

export function getStoresGroupedByRegion(stores: RetailStore[] = RETAIL_STORES) {
  const REGION_ORDER: RetailStore["region"][] = [
    "北部",
    "中部",
    "南部",
    "東部",
    "離島",
  ];

  const presentRegions = Array.from(new Set(stores.map((store) => store.region)));

  return REGION_ORDER.filter((region) => presentRegions.includes(region)).map(
    (region) => ({
      region,
      stores: stores.filter((store) => store.region === region),
    }),
  );
}

/**
 * 全台販售昔馬 SMASMALL 電動刮鬍刀之實體門市
 * 資料來源：WEiZ 官方 LINE 櫃位據點、JC科技官網門市資訊（2026）
 */
export const RETAIL_STORES: RetailStore[] = [
  {
    id: "weiz-chiayi",
    name: "WEiZ 嘉義秀泰店",
    brand: "WEiZ 精品3C",
    region: "中部",
    city: "嘉義市",
    address: "嘉義市西區文化路299號1樓（嘉義秀泰生活）",
    phone: "05-3208040",
    hours: "每日 11:00 – 22:00",
    note: "威柏科技旗下選物店，可體驗昔馬刮鬍刀系列",
    mapsUrl: "https://maps.app.goo.gl/pAuMevHryYvVAh4E7",
  },
  {
    id: "weiz-taichung",
    name: "WEiZ 台中文心秀泰店",
    brand: "WEiZ 精品3C",
    region: "中部",
    city: "台中市",
    address: "台中市南屯區文心南路289號1樓（文心秀泰生活）",
    phone: "04-37048488",
    hours: "平日 11:00 – 22:00｜假日 10:30 – 22:00",
    note: "威柏科技旗下選物店，可體驗昔馬刮鬍刀系列",
    mapsUrl: "https://maps.app.goo.gl/W7Bg4iXpCRWBQ2Ke6",
  },
  {
    id: "jc-taichung",
    name: "JC科技 台中公益店",
    brand: "JC科技官方旗艦店",
    region: "中部",
    city: "台中市",
    address: "台中市西區公益路188-1號",
    phone: "04-2326-5611",
    hours: "每日 12:00 – 22:00",
    note: "昔馬 SMASMALL 授權經銷，建議前往前致電確認庫存",
  },
  {
    id: "weiz-kaohsiung",
    name: "WEiZ 高雄岡山樂購店",
    brand: "WEiZ 精品3C",
    region: "南部",
    city: "高雄市",
    address: "高雄市岡山區捷安路1巷2號1樓（岡山樂購廣場）",
    phone: "07-9715557",
    hours: "每日 11:00 – 22:00",
    note: "威柏科技旗下選物店，可體驗昔馬刮鬍刀系列",
    mapsUrl: "https://maps.app.goo.gl/DkKuRovqTmFEJRvb9",
  },
];
