export type HomeProductIntroSpec = {
  label: string;
  value: string;
};

export type HomeProductIntroSection = {
  backgroundImage: string;
  subtitle: string;
  title: string;
  description: string;
  specs: HomeProductIntroSpec[];
};

/** 後台無資料或 API 失敗時的預設內容 */
export const HOME_PRODUCT_INTRO_FALLBACK: HomeProductIntroSection = {
  backgroundImage: "",
  subtitle: "上蓋特寫",
  title: "磁吸防塵保護蓋",
  description: "磁吸式上蓋一貼即合，隔絕灰塵、守護刀頭，收納潔淨衛生。",
  specs: [
    { label: "適用機型", value: "S3 旗艦版刮鬍刀" },
    { label: "核心功能", value: "磁吸防塵保護蓋" },
    { label: "磁吸結構", value: "一貼即合" },
    { label: "機身材質", value: "鋅合金壓鑄" },
  ],
};
