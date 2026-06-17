export type RetailStore = {
  id: string;
  name: string;
  brand: string;
  region: "中部" | "南部";
  city: string;
  address: string;
  phone: string;
  hours: string;
  note?: string;
};

/** 產生 Google Maps 搜尋／導航連結 */
export function getGoogleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
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
  },
];

const REGION_ORDER = ["中部", "南部"] as const;

export function getStoresGroupedByRegion() {
  return REGION_ORDER.map((region) => ({
    region,
    stores: RETAIL_STORES.filter((store) => store.region === region),
  })).filter((group) => group.stores.length > 0);
}
