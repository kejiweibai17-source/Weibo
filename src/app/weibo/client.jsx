"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Copy from "@/components/Copy";

// ============================================================================
// 威柏科技 WEIBO 企業介紹頁 — 資料設定
// ============================================================================

/** 編碼中文／空白路徑，供 next/image 使用 */
const asset = (path) => encodeURI(`/images/素材/${path}`);
const brandLogo = (path) => encodeURI(`/images/素材/各品牌logo/${path}`);
const agencyLogo = (path) =>
  encodeURI(`/images/素材/各品牌logo/－代理經銷品牌 logo－/${path}`);

/** 歷史沿革：圖文時間軸 */
const TIMELINE = [
  {
    year: "2015",
    side: "right",
    text: "威柏科技貿易公司籌備處成立",
    media: "logo",
    image: brandLogo("威柏.png"),
  },
  {
    year: "2016",
    side: "left",
    text: "成為國內各大連鎖 3C 賣場通路供應商",
    image: asset("歷史2016.jpg"),
  },
  {
    year: "2016",
    side: "right",
    text: "成立電子商務部門，並於國內電商平台上架",
    image: asset("歷史2016 02.jpg"),
    imageShape: "round",
  },
  {
    year: "2017",
    side: "left",
    text: "線上客服與檢修部門成立",
    image: asset("歷史2017.jpg"),
  },
  {
    year: "2018",
    side: "right",
    text: "專案業務部成立",
  },
  {
    year: "2019",
    side: "left",
    text: "WEIZ 通路品牌成立",
    media: "weiz",
    image: brandLogo("weiz.png"),
  },
  {
    year: "2022",
    side: "right",
    text: "打造台灣 OMO 整合系統，深度服務全通路顧客",
    image: asset("歷史2022.jpg"),
  },
  {
    year: "2024",
    side: "left",
    text: "打造線上新零售，提供代理品牌全台消費者線上、線下體驗及售後服務",
    image: asset("歷史2024.jpg"),
  },
  {
    year: "2025",
    side: "right",
    text: "WEIZ 佈局三家中南部旗艦體驗店：高雄、台南、台中",
  },
];

const BRAND_LOGOS = [
  {
    name: "WEILIFE",
    logoClass:
      "text-[17px] md:text-[19px] font-extrabold tracking-[0.04em] text-[#2ec4b6]",
    image: asset("P4 WEILIFE.jpg"),
    logo: brandLogo("weilife.png"),
  },
  {
    name: "smasmall® 昔馬",
    logoClass:
      "text-[16px] md:text-[18px] font-bold tracking-[0.04em] text-slate-900",
    image: asset("P4 昔馬.jpg"),
    logo: brandLogo("昔馬.png"),
  },
  {
    name: "FRAMULA",
    sub: "芬乘®",
    logoClass:
      "text-[16px] md:text-[18px] font-extrabold tracking-[0.1em] text-slate-900",
    image: asset("P4 芬乘.jpg"),
    logo: brandLogo("芬乘FRAMULA_LOGO_黑.png"),
  },
  {
    name: "WiWU",
    logoClass:
      "text-[17px] md:text-[19px] font-extrabold tracking-[0.04em] text-[#1e3a8a]",
    image: asset("P4 WIWU.jpg"),
    logo: brandLogo("WiWU Logo去背.png"),
  },
  {
    name: "ACEFAST",
    logoClass:
      "text-[16px] md:text-[18px] font-extrabold italic tracking-[0.04em] text-[#22c55e]",
    image: asset("P4 ACEFAST.jpg"),
    logo: brandLogo("ACEFAST logo.png"),
  },
];

/** 代理品牌：資料夾內全部 logo，拆成三排跑馬燈 */
const AGENCY_BRAND_FILES = [
  "LOGO_三鍵客_Keychron.png",
  "LOGO_世貨_Blue.png",
  "LOGO_世貨_FOREO.png",
  "LOGO_世貨_Harman Kardon.png",
  "LOGO_世貨_SENNHEISER.png",
  "LOGO_世貨_Ultimate Ears.png",
  "LOGO_世貨_ag.png",
  "LOGO_世貨_final.png",
  "LOGO_和鑫_1more.png",
  "LOGO_嘉友_MAIIN SOUND.png",
  "LOGO_威柏_DeLUX.png",
  "LOGO_威柏_MOFT.png",
  "LOGO_拓勤_GPLUS.png",
  "LOGO_旺德_Blaupunkt.png",
  "LOGO_旺德_ISITO.png",
  "LOGO_旺德_Karl Lagerfeld.png",
  "LOGO_旺德_SABA.png",
  "LOGO_旺德_TECO.png",
  "LOGO_旺德_TUMI.png",
  "LOGO_旺德_Thomson.png",
  "LOGO_旺德_Wonder.png",
  "LOGO_沃福仕_BOSE.png",
  "LOGO_澎湃_鐵三角audio-technica.png",
  "LOGO_瑞立_AUKEY.png",
  "LOGO_瑞立_Adamoutdoor.png",
  "LOGO_瑞立_COMITOK.png",
  "LOGO_瑞立_Choetech.png",
  "LOGO_瑞立_Energea.png",
  "LOGO_瑞立_GUXON.png",
  "LOGO_瑞立_KooPin.png",
  "LOGO_瑞立_LAPO.png",
  "LOGO_瑞立_MOZ.png",
  "LOGO_瑞立_MR.COM.png",
  "LOGO_瑞立_Momax.png",
  "LOGO_瑞立_ORAIR.png",
  "LOGO_瑞立_SCANDINAVIAN FOREST.png",
  "LOGO_瑞立_SKINARMA.png",
  "LOGO_瑞立_Solide.png",
  "LOGO_瑞立_TORRAS.png",
  "LOGO_瑞立_UAG.png",
  "LOGO_瑞立_UNIQ.png",
  "LOGO_瑞立_USAMS.png",
  "LOGO_瑞立_Zumoji.png",
  "LOGO_瑞立_alto.png",
  "LOGO_瑞立_bitplay.png",
  "LOGO_瑞立_樂米LARMi.png",
  "LOGO_積進_MYCELL.png",
  "LOGO_美極品_美極品.png",
  "LOGO_聿鑫_Audioengine.png",
  "LOGO_聿鑫_FANTECH.png",
  "LOGO_聿鑫_FIFINE.png",
  "LOGO_聿鑫_FiiO.png",
  "LOGO_聿鑫_Kanto.png",
  "LOGO_聿鑫_MACHENIKE.png",
  "LOGO_聿鑫_NOWGO.png",
  "LOGO_萬摩_Allite.png",
  "LOGO_萬摩_Chipolo.png",
  "LOGO_萬摩_OneMore.png",
  "LOGO_行星_VAGO.png",
  "LOGO_鉅誠_JC TECH.png",
];

const AGENCY_BRANDS = AGENCY_BRAND_FILES.map((file) => {
  const base = file.replace(/\.[^.]+$/, "");
  const name = base.replace(/^LOGO_[^_]+_/, "");
  return { name, logo: agencyLogo(file) };
});

function chunkBrands(list, rows) {
  const size = Math.ceil(list.length / rows);
  return Array.from({ length: rows }, (_, i) =>
    list.slice(i * size, (i + 1) * size),
  ).filter((row) => row.length > 0);
}

/** 核心業務四卡 */
const CORE_BUSINESS = [
  {
    no: "01",
    title: "品牌代理",
    desc: "總代理各國原創品牌，原廠授權引進與通路管理。",
    image: asset("P2核心業務01.jpg"),
  },
  {
    no: "02",
    title: "國際外銷",
    desc: "從台灣零售延伸至香港、新加坡等海外市場。",
    image: asset("P2核心業務02.jpg"),
  },
  {
    no: "03",
    title: "台灣全通路推廣",
    desc: "台灣通路、百貨櫃位、連鎖3C賣場與電商平台完整佈局線上線下全通路整合。",
    image: asset("P2核心業務03.jpg"),
  },
  {
    no: "04",
    title: "企業採購",
    desc: "提供企業專案與大宗採購的選品與客製服務。",
    image: asset("P2核心業務04.jpg"),
  },
];

/**
 * 日系排版字級／間距（只統一文字尺度，不改桌面構圖）
 * eyebrow → h2 → body 階梯；行高偏鬆、字距微開
 */
const TYPO = {
  eyebrow:
    "text-[11px] md:text-xs font-medium uppercase tracking-[0.28em] text-[#c4a574]",
  h2: "text-[26px] md:text-[32px] font-bold tracking-[0.04em] leading-[1.4] text-slate-900",
  body: "text-[14px] md:text-[15px] leading-[1.95] tracking-[0.03em] text-slate-600",
  bodyMuted:
    "text-[14px] md:text-[15px] leading-[1.95] tracking-[0.03em] text-[#666666]",
  cardTitle:
    "text-[16px] md:text-[17px] font-bold tracking-[0.06em] leading-snug",
  cardBody:
    "text-[13px] md:text-[14px] leading-[1.9] tracking-[0.04em] text-slate-500",
  year: "text-[24px] md:text-[34px] font-bold tracking-[0.02em] text-[#4d5aff]",
  cta: "text-[13px] md:text-sm font-bold tracking-[0.06em]",
};

const SECTION_PAD = "py-20 md:py-28";
const SECTION_X = "px-6 lg:px-16";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function WeiboClient() {
  return (
    <div className="w-full bg-white text-slate-900 font-sans antialiased overflow-hidden tracking-[0.02em]">
      <HeroSection />
      <IntroSection />
      <ImportExportSection />
      <TimelineSection />
      <OurBrandsSection />
      <CloudWarrantySection />
    </div>
  );
}

/* ============================================================================
   SECTION 1 — Hero：網羅全球創意與設計的品牌，提供有質感的生活
   ============================================================================ */
function HeroSection() {
  return (
    <section className="relative flex h-[68vh] min-h-[440px] w-full items-end overflow-hidden bg-[#05070d] md:h-[78vh] md:min-h-[520px]">
      {/* 科技辦公桌情境背景照片 */}
      <div className="absolute inset-0">
        <Image
          src={asset("0大圖.jpg")}
          alt="網羅全球創意與設計的品牌"
          fill
          priority
          className="object-cover object-[70%_center] md:object-center"
        />
        <div className="absolute inset-0 bg-[#05070d]/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(56,132,255,0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/55 to-transparent" />
      </div>

      <div
        className={`relative z-10 mx-auto w-full max-w-[1600px] pb-12 md:pb-20 ${SECTION_X}`}
      >
        <Copy>
          <h1 className="max-w-[18em] text-[28px] font-bold leading-[1.35] tracking-[0.02em] text-white md:max-w-none md:text-5xl md:leading-[1.3] lg:text-6xl">
            網羅全球創意
            <br />
            與設計的品牌
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              提供有質感的生活
            </span>
          </h1>
        </Copy>
      </div>
    </section>
  );
}

/* ============================================================================
   SECTION 2 — NEW BEGINNINGS：品牌介紹 + 全球網絡視覺
   ============================================================================ */
function IntroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* 透明淺灰三角背景：從右上斜切、貫穿 NEW BEGINNINGS 與核心業務兩個區塊 */}
      <div
        className="pointer-events-none absolute inset-[-25%] z-[5]"
        aria-hidden
        style={{
          clipPath: "polygon(68% 0, 100% 0, 100% 100%, 14% 100%)",
          background: "rgba(226, 229, 234, 0.28)",
          transform: "rotate(-80deg)",
          transformOrigin: "50% 50%",
        }}
      />
      <section className="relative w-full overflow-hidden bg-white px-6 py-20 sm:px-10 md:py-28 lg:px-16 lg:py-32">
        {/* 參考稿：右上淡紫、左下淡灰大字 */}
        <span className="pointer-events-none absolute right-[2.5%] top-[1.5%] z-0 select-none whitespace-nowrap text-[11vw] font-bold leading-none tracking-[-0.035em] text-[#c7c8f4] sm:text-[8vw] lg:text-[clamp(52px,5.5vw,86px)]">
          NEW BEGINNINGS
        </span>
        <span className="pointer-events-none absolute bottom-[2.5%] left-[2%] z-0 select-none whitespace-nowrap text-[9.5vw] font-bold leading-none tracking-[-0.04em] text-[#d9dadd] sm:text-[7vw] lg:text-[clamp(46px,4.8vw,74px)]">
          HEARTFELT CONNECTIONS
        </span>

        <div className="relative z-10 mx-auto max-w-[1320px]">
          <div className="grid grid-cols-1 items-center gap-14 pt-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:pt-0">
            {/* 左：參考稿的置中直式 Logo + 內文 */}
            <Reveal>
              <div>
                <div className="mb-9 flex flex-col items-center text-center md:mb-11">
                  <div className="relative h-[150px] w-[150px] md:h-[190px] md:w-[190px]">
                    <Image
                      src={brandLogo("威柏.png")}
                      alt="WEIBO 威柏科技"
                      fill
                      className="object-contain"
                      sizes="190px"
                    />
                  </div>
                </div>

                <p className="mx-auto max-w-[560px] text-[14px] font-medium leading-[2] tracking-[0.015em] text-[#161616] md:text-[15px] md:leading-[2.1] lg:mx-0">
                  威柏科技貿易有限公司成立於 2015
                  年，立足全球視野、深耕台灣市場，網羅世界各地具創意與設計感的品牌，致力於將優質生活提案帶給台灣消費者，我們堅信科技產品經過我們的淬煉，能精準有感的帶給消費者更好的生活體驗。
                </p>
              </div>
            </Reveal>

            {/* 右：無圓角世界圖，左上方以細框向外錯位 */}
            <Reveal delay={0.12}>
              <div className="relative mx-auto w-full max-w-[650px]">
                <div
                  className="pointer-events-none absolute -left-[7%] -top-[18%] h-[88%] w-[68%] border-2 border-[#dfe3ec]"
                  aria-hidden
                />
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={asset("P1右側.jpg")}
                    alt="全球品牌網絡"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 650px"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <section
        className={`relative w-full overflow-hidden bg-white ${SECTION_X} ${SECTION_PAD}`}
      >
        {/* 左下藍三角 */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 z-0 h-[72px] w-[120px] bg-[#4d5aff] md:h-[96px] md:w-[160px]"
          style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-[1400px]">
          <Reveal>
            <h2 className="mb-10 text-[32px] font-bold leading-[1.35] tracking-[0.04em] text-slate-900 md:mb-12 md:text-[40px]">
              核心業務
            </h2>
          </Reveal>

          {/* 卡片依設計稿：高矮交錯（01、03 較高，02、04 較矮），上緣切齊、整排與右側按鈕同寬 */}
          <div className="grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 md:gap-6">
            {CORE_BUSINESS.map((item, idx) => (
              <Reveal key={item.no} delay={0.06 * idx}>
                <article
                  className={`relative w-full overflow-hidden rounded-lg shadow-[0_2px_12px_rgba(15,23,42,0.06)] ${
                    idx % 2 === 0 ? "aspect-[7/10]" : "aspect-[8/9]"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  {/* 半透明白遮罩＋輕微模糊：底圖仍可見，文字對比更清楚 */}
                  <div className="absolute inset-0 bg-white/45 backdrop-blur-[2px]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/40" />

                  <div className="relative z-10 flex h-full flex-col px-5 py-5 md:px-6 md:py-6">
                    <span className="text-[24px] font-bold leading-none tracking-[0.02em] text-[#3340d9] md:text-[28px]">
                      {item.no}
                    </span>
                    <h3 className="mt-5 text-center text-[22px] font-bold tracking-[0.06em] text-[#3340d9] md:mt-7 md:text-[24px]">
                      {item.title}
                    </h3>
                    <p className="mt-5 text-center text-[15px] font-medium leading-[1.9] tracking-[0.04em] text-[#1f2937] md:mt-7 md:text-[16px]">
                      {item.desc}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-col items-center md:mt-12 lg:items-end">
              <a
                href="/contact"
                className={`inline-flex w-full max-w-[280px] items-center justify-center gap-2 rounded-full bg-[#22d3ee] px-8 py-3.5 text-white shadow-md transition-colors hover:bg-cyan-400 sm:w-auto ${TYPO.cta}`}
              >
                立即聯繫
                <span aria-hidden>→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </section>
  );
}

/* ============================================================================
   SECTION 3 — 從進出口到總代理視覺 + PHILOSOPHY + 品牌矩陣
   ============================================================================ */
function ImportExportSection() {
  return (
    <section>
      {/* —— 手機／平板：色塊為底、圖片蓋上（桌面隱藏） —— */}
      <section className="relative w-full overflow-hidden  lg:hidden">
        <div className="relative aspect-[5/4] w-full sm:aspect-[16/10]">
          {/* 底層色塊 */}
          <Image
            src="/images/weibo/section3/昔馬網站_威柏頁面-3.png"
            alt=""
            fill
            className="object-cover object-[68%_center]"
            sizes="100vw"
            aria-hidden
          />
          {/* 圖片蓋在色塊上面 */}
          <div className="absolute inset-x-[5%] top-[8%] z-10 aspect-[4/3] overflow-hidden rounded-sm shadow-[0_16px_48px_rgba(0,0,0,0.4)] sm:inset-x-[8%] sm:top-[10%]">
            <Image
              src={asset("P3左側.jpg")}
              alt="從進出口到總代理"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 92vw, 800px"
            />
          </div>
        </div>
        <div className="relative z-10 px-6 pb-12 pt-4 sm:px-10 sm:pb-14">
          <Reveal>
            <h2 className="text-[24px] font-bold leading-[1.45] tracking-[0.04em]  sm:text-[28px]">
              從進出口到總代理
            </h2>
            <p className="mt-5 max-w-xl text-[14px] leading-[2] tracking-[0.04em] text-white/88 sm:text-[15px]">
              從主要經營進口業務一路發展到台，產品囊括生活家電、消費性電子、手機周邊、筆電配件、車用百貨等等——銷售市場從台灣零售店、百貨櫃位延伸至新加坡、香港等國際外銷業務，打造完整通路舞台，讓好產品淋漓發揮。
            </p>
          </Reveal>
        </div>
      </section>

      {/* —— 桌面：原排版；isolate 避免絕對定位蓋住下方 PHILOSOPHY —— */}
      <section className="relative z-0 isolate hidden w-full overflow-hidden lg:block">
        {/* 高度貼齊內容（色塊＋圖文），避免底部大片留白把下個 section 推遠 */}
        <div className="relative h-[calc(20vh+620px)] overflow-hidden">
          <div className="absolute right-[-130px] top-[20%] z-20 h-[600px] w-[1900px]">
            <div className="flex h-[500px]">
              <div className="relative w-1/2 overflow-hidden bg-gray-800">
                <Image
                  src={asset("P3左側.jpg")}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex w-1/2 max-w-[620px] flex-col justify-center p-10">
                <h2 className="text-[30px] font-bold leading-[1.4] tracking-[0.04em] text-white md:text-[36px]">
                  從進出口到總代理
                </h2>
                <div className="mt-7 space-y-6 text-[17px] leading-[2] tracking-[0.03em] text-white/95 md:text-[19px]">
                  <p>
                    從主要經營進口業務一路發展到台灣總代理各國品牌，至今旗下運營數個來自美國、日本、中國等地的原創品牌。
                  </p>
                  <p>
                    產品囊括生活家電、消費性電子、手機周邊、筆電配件、車用百貨等等——
                  </p>
                  <p>
                    銷售市場從台灣零售店、百貨櫃位延伸至新加坡、香港等國際外銷業務，打造完整通路舞台，讓好產品淋漓發揮。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute right-[-130px] top-0 z-10 w-[110vw]">
            <div className="flex">
              <img
                src="/images/weibo/section3/昔馬網站_威柏頁面-3.png"
                className="w-full"
                alt=""
              />
            </div>
          </div>

          {/* 右上 EXPORT／左下 IMPORT 直式裝飾字（由下往上讀） */}
          <span
            className="pointer-events-none absolute right-4 top-[10%] z-30 select-none text-[56px] font-black uppercase leading-none tracking-[0.16em] text-white/30 [writing-mode:vertical-rl] rotate-180"
            aria-hidden
          >
            EXPORT
          </span>
          <span
            className="pointer-events-none absolute bottom-[3%] left-4 z-30 select-none text-[56px] font-black uppercase leading-none tracking-[0.16em] text-slate-500/40 [writing-mode:vertical-rl] rotate-180"
            aria-hidden
          >
            IMPORT
          </span>
        </div>
      </section>

      <section
        className={`relative z-20 overflow-hidden bg-white ${SECTION_X} ${SECTION_PAD}`}
      >
        {/* 右下灰三角 */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 z-0 h-[80px] w-[140px] bg-[#d4d4d4] md:h-[180px] md:w-[320px]"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-[1100px]">
          <div className="mx-auto max-w-[720px] text-center">
            <p className={TYPO.eyebrow}>PHILOSOPHY</p>
            <h2 className="mt-5 text-[32px] font-bold leading-[1.35] tracking-[0.04em] text-slate-900 md:text-[42px]">
              科技來自於人性
            </h2>
            <p className={`mt-6 ${TYPO.bodyMuted}`}>
              威柏科技讓產品從無到有，經過研發、設計、選品、推廣、銷售、體驗、服務，以最嚴格的標準要求每一款產品。消費者的每一個需求，都是我們開發與推廣產品的動力；每一筆消費，都是對我們的信任。
            </p>
          </div>

          {/* 手機：2 欄；sm+：上 3 下 2（桌面構圖不變） */}
          <div className="mt-12 grid grid-cols-2 gap-5 sm:hidden">
            {BRAND_LOGOS.map((brand, i) => (
              <div
                key={brand.name}
                className={
                  i === BRAND_LOGOS.length - 1 && BRAND_LOGOS.length % 2 === 1
                    ? "col-span-2 mx-auto w-[calc(50%-0.625rem)]"
                    : undefined
                }
              >
                <BrandShowcaseCard brand={brand} />
              </div>
            ))}
          </div>

          <div className="mt-14 hidden grid-cols-1 gap-10 sm:mt-16 sm:grid sm:grid-cols-3 sm:gap-6 md:gap-8">
            {BRAND_LOGOS.slice(0, 3).map((brand) => (
              <BrandShowcaseCard key={brand.name} brand={brand} />
            ))}
          </div>

          <div className="mt-10 hidden flex-col items-stretch justify-center gap-10 sm:mt-12 sm:flex sm:flex-row sm:gap-6 md:gap-8">
            {BRAND_LOGOS.slice(3).map((brand) => (
              <div
                key={brand.name}
                className="w-full sm:w-[calc((100%-1.5rem)/3)] md:w-[calc((100%-2rem)/3)]"
              >
                <BrandShowcaseCard brand={brand} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}

function BrandShowcaseCard({ brand }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
        <Image
          src={brand.image}
          alt={brand.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      </div>
      <div className="mt-5 flex w-full flex-col items-center md:mt-6">
        {brand.logo ? (
          // 固定高度容器 + object-contain：不同寬高比的 logo 視覺面積一致
          <div className="relative h-[56px] w-full max-w-[240px] md:h-[68px] md:max-w-[280px]">
            <Image
              src={brand.logo}
              alt={brand.name}
              fill
              className="object-contain object-center"
              sizes="280px"
            />
          </div>
        ) : brand.name === "smasmall® 昔馬" ? (
          <span className={brand.logoClass}>
            smasmall<sup className="text-[10px]">®</sup>
            <span className="ml-1.5">昔馬</span>
          </span>
        ) : (
          <span className={brand.logoClass}>{brand.name}</span>
        )}
        {brand.sub ? (
          <span className="mt-1.5 text-[12px] font-medium tracking-[0.12em] text-slate-600 md:text-[13px]">
            {brand.sub}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/* ============================================================================
   SECTION 4 — 歷史沿革 Timeline（圖文交錯，下滑跳出）
   ============================================================================ */
function TimelineSection() {
  return (
    <section
      className={`relative w-full overflow-hidden bg-white ${SECTION_PAD}`}
    >
      {/* 背景浮水印 */}
      <span
        className="pointer-events-none absolute left-4 top-8 select-none text-[14vw] font-extrabold leading-none tracking-[0.04em] text-slate-100 md:left-10 md:top-12 md:text-[7vw]"
        aria-hidden
      >
        MILESTONES
      </span>

      {/* 左側素材方匡圖（僅桌面／平板） */}
      <div className="pointer-events-none absolute left-[-4%] top-[28%] z-[1] hidden w-[120px] md:block lg:w-[220px] xl:w-[320px]">
        <Image
          src="/images/weibo/section4/昔馬網站_威柏頁面-4.png"
          alt=""
          width={400}
          height={400}
          className="h-auto w-full select-none"
          aria-hidden
        />
      </div>
      {/* 右側素材方匡圖 */}
      <div className="pointer-events-none absolute right-[-5%] top-[42%] z-[1] hidden w-[120px] md:block lg:w-[220px] xl:w-[320px]">
        <Image
          src="/images/weibo/section4/昔馬網站_威柏頁面-5.png"
          alt=""
          width={400}
          height={400}
          className="h-auto w-full select-none"
          aria-hidden
        />
      </div>

      {/* 右上藍三角 */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[72px] w-[96px] bg-[#4d5aff] md:h-[160px] md:w-[220px]"
        style={{ clipPath: "polygon(40% 0, 100% 0, 100% 100%)" }}
        aria-hidden
      />
      {/* 左下灰＋藍三角 */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[72px] w-[120px] bg-[#d0d0d0] md:h-[160px] md:w-[280px]"
        style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[36px] w-[100px] bg-[#4d5aff] md:h-[72px] md:w-[220px]"
        style={{ clipPath: "polygon(0 40%, 0 100%, 70% 100%)" }}
        aria-hidden
      />

      <div className={`relative z-10 mx-auto max-w-[1100px] ${SECTION_X}`}>
        <Reveal>
          <h2 className={`mb-14 text-center md:mb-16 ${TYPO.h2}`}>歷史沿革</h2>
        </Reveal>

        <div className="relative">
          {/* 中央軸線 */}
          <div className="absolute bottom-2 left-[11px] top-2 w-px bg-slate-200 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-12 md:space-y-14">
            {TIMELINE.map((item, idx) => {
              const isLeft = item.side === "left";
              return (
                <TimelineItem
                  key={`${item.year}-${idx}`}
                  item={item}
                  isLeft={isLeft}
                  index={idx}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ item, isLeft, index }) {
  return (
    <motion.div
      className="relative md:grid md:grid-cols-2 md:items-center md:gap-12"
      initial={{ opacity: 0, y: -36, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.65,
        delay: 0.05 * (index % 4),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* 節點 */}
      <div className="absolute left-[7px] top-3 z-10 h-2.5 w-2.5 rounded-full bg-[#4d5aff] ring-[5px] ring-white md:left-1/2 md:top-1/2 md:h-3 md:w-3 md:-translate-x-1/2 md:-translate-y-1/2" />

      {isLeft ? (
        <>
          <div className="pl-10 md:pl-0 md:pr-10 md:text-right">
            <TimelineMedia item={item} align="right" />
            <p className="mt-3 text-[30px] font-bold tracking-[0.02em] text-[#4d5aff] md:text-[42px]">
              {item.year}
            </p>
            <p className="mt-2.5 text-[16px] leading-[1.95] tracking-[0.03em] text-slate-600 md:text-[18px]">
              {item.text}
            </p>
          </div>
          <div className="hidden md:block" />
        </>
      ) : (
        <>
          <div className="hidden md:block" />
          <div className="pl-10 md:pl-10">
            {item.media === "logo" ? (
              <div className="mb-4">
                <Image
                  src={brandLogo("威柏.png")}
                  alt="WEIBO 威柏科技"
                  width={160}
                  height={160}
                  className="h-28 w-28 object-contain md:h-36 md:w-36"
                />
              </div>
            ) : null}
            <p className="text-[30px] font-bold tracking-[0.02em] text-[#4d5aff] md:text-[42px]">
              {item.year}
            </p>
            <p className="mt-2.5 text-[16px] leading-[1.95] tracking-[0.03em] text-slate-600 md:text-[18px]">
              {item.text}
            </p>
            {item.media !== "logo" ? (
              <div className="mt-4">
                <TimelineMedia item={item} align="left" />
              </div>
            ) : null}
          </div>
        </>
      )}
    </motion.div>
  );
}

function TimelineMedia({ item, align = "left" }) {
  if (!item.image || item.media === "logo") return null;

  const round = item.imageShape === "round";
  const isLogo = item.media === "weiz";

  return (
    <div
      className={`relative overflow-hidden ${
        isLogo
          ? "flex h-20 w-full max-w-[220px] items-center justify-center bg-transparent sm:h-24 sm:max-w-[280px] md:h-28 md:max-w-[320px]"
          : round
            ? "mx-auto h-28 w-28 rounded-full bg-slate-100 shadow-sm sm:h-36 sm:w-36 md:h-40 md:w-40"
            : "aspect-[16/10] w-full max-w-full rounded-xl bg-slate-100 shadow-sm sm:max-w-[280px] sm:rounded-2xl"
      } ${align === "right" ? "md:ml-auto" : ""} ${
        isLogo && align === "right" ? "md:justify-end" : ""
      } ${isLogo && align === "left" ? "md:justify-start" : ""}`}
    >
      <Image
        src={item.image}
        alt={item.text}
        fill
        className={isLogo ? "object-contain" : "object-cover"}
        sizes={isLogo ? "320px" : "280px"}
      />
    </div>
  );
}

/* ============================================================================
   SECTION 5 — OUR BRANDS 代理品牌三排無限跑馬燈
   ============================================================================ */
function BrandMarqueeRow({ brands, reverse = false, duration = 48 }) {
  // 複製兩份做無縫循環
  const slides = [...brands, ...brands];
  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max gap-3 md:gap-4 ${
          reverse ? "animate-weibo-marquee-reverse" : "animate-weibo-marquee"
        }`}
        style={{ animationDuration: `${duration}s` }}
      >
        {slides.map((brand, i) => (
          <div
            key={`${brand.name}-${i}`}
            className="flex h-[72px] w-[140px] shrink-0 items-center justify-center rounded-xl bg-white px-4 shadow-[0_2px_14px_rgba(15,23,42,0.06)] sm:h-[80px] sm:w-[160px] md:h-[88px] md:w-[180px]"
          >
            <div className="relative h-9 w-full sm:h-10 md:h-11">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OurBrandsSection() {
  const rows = chunkBrands(AGENCY_BRANDS, 3);

  return (
    <section
      className={`relative w-full overflow-hidden bg-[#faf8f4] ${SECTION_PAD}`}
    >
      <div className={`relative z-10 mx-auto max-w-[1400px] ${SECTION_X}`}>
        <Reveal>
          <div className="mx-auto max-w-[720px] text-center">
            <p className={TYPO.eyebrow}>OUR BRANDS</p>
            <h2 className={`mt-5 ${TYPO.h2}`}>代理品牌</h2>
          </div>
        </Reveal>
      </div>

      <div className="relative z-10 mt-12 space-y-3 md:mt-14 md:space-y-4">
        {rows.map((row, idx) => (
          <BrandMarqueeRow
            key={idx}
            brands={row}
            reverse={idx % 2 === 1}
            duration={42 + idx * 8}
          />
        ))}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes weibo-marquee {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            @keyframes weibo-marquee-reverse {
              from { transform: translateX(-50%); }
              to { transform: translateX(0); }
            }
            .animate-weibo-marquee {
              animation: weibo-marquee linear infinite;
            }
            .animate-weibo-marquee-reverse {
              animation: weibo-marquee-reverse linear infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .animate-weibo-marquee,
              .animate-weibo-marquee-reverse {
                animation: none !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

/* ============================================================================
   SECTION 6 — CLOUD WARRANTY 貼心服務，隨身保固
   ============================================================================ */
function CloudWarrantySection() {
  return (
    <section
      className={`relative w-full overflow-hidden bg-gradient-to-r from-[#faf8f4] via-[#f6f1e8] to-[#efe6d6] ${SECTION_PAD}`}
    >
      <div className={`relative z-10 mx-auto max-w-[1200px] ${SECTION_X}`}>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)] lg:gap-16">
          <Reveal>
            <p className={TYPO.eyebrow}>CLOUD WARRANTY</p>
            <h2 className={`mt-5 ${TYPO.h2}`}>貼心服務，隨身保固</h2>
            <p className={`mt-6 max-w-[560px] ${TYPO.body}`}>
              於威柏科技 LINE
              官方帳號完成登入或加入會員，即可進入「保固登錄」表單，上傳產品資料與購買憑證即可迅速完成保固。解鎖線上服務，簡單又貼心——無論在何處購買威柏代理產品，都能享受貼心高效的售後服務。
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col items-start lg:items-end">
              <a
                href="https://www.weiboltd.com/warranty"
                className={`inline-flex min-w-[180px] items-center justify-center rounded-md bg-[#c6a96e] px-10 py-4 text-slate-900 shadow-sm transition-colors hover:bg-[#b8975c] ${TYPO.cta}`}
              >
                保固登錄
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
