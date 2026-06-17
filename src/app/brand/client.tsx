"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import WaabiScrollIntro from "@/components/WaabiScrollIntro";
import { Globe, ArrowRight } from "lucide-react";
import Copy from "@/components/Copy";
const LINE_OFFICIAL_URL =
  "https://page.line.me/157yqtwl?oat_content=url&openQrModal=true";

// ============================================================================
// 昔馬 SMASMALL 真實產品系列資料設定 (全繁體中文在地化)
// ============================================================================
const CORE_STATS = [
  { value: "100%", label: "全合金壓鑄機身" },
  { value: "1 秒", label: "磁吸刀頭快拆" },
  { value: "IPX7", label: "全機防水乾濕兩用" },
  { value: "0.05mm", label: "荷蘭進口精鋼刀網" },
  { value: "12 個月", label: "台灣總代理原廠保固" },
];
const PRODUCT_CATEGORIES = [
  {
    categoryTitle: "Premium Alloy Series",
    categorySubtitle: "經典合金系列",
    products: [
      {
        name: "昔馬 S1 經典青春版",
        slogan: "重塑經典，品味隨行。",
        description:
          "採用獨創高溫壓鑄全合金機身，手感沉穩冰冷。搭載荷蘭進口精鋼刀片與雙環超薄刀網，配合自研磨技術，越用越鋒利。支援 IPX7 全機防水，乾濕兩用，讓您隨時保持俐落清爽的面貌。",
        imgUrl: "/images/accessories/青春版電動刮鬍刀禮盒-三色/情境圖/004.jpg", // 替換為 S1 產品圖
        reverse: false, // 圖片在左
      },
      {
        name: "昔馬捍衛者",
        slogan: "小。很強大。",
        description:
          "把刮鬍、修容、收納與快充，放進精巧而有份量的全合金設計。磁吸式快拆刀頭、荷蘭進口精鋼刀網與 IPX7 全機防水，兼顧硬派質感與日常便利。",
        imgUrl: "/images/61e0b64e-1f2c-465c-91e6-34dde2596b4e.png",
        reverse: true, // 圖片在右
      },
      {
        name: "昔馬 S1-DK 黑夜騎士",
        slogan: "深邃暗黑，硬派美學。",
        description:
          "延續 S1 經典架構，披上極致深邃的消光黑夜塗裝。專為低調且注重質感的都會男士設計，每一處細節都散發著復古未來主義的獨特魅力，是展現個人風格的最佳桌面理容藝術品。",
        imgUrl: "/images/index/banner-02.png", // 替換為黑夜騎士版產品圖
        reverse: false, // 圖片在左
      },
    ],
  },
  {
    categoryTitle: "Exclusive Gift Sets",
    categorySubtitle: "尊榮限定禮盒",
    products: [
      {
        name: "昔馬 x 威柏 尊榮理容套裝",
        slogan: "送禮首選，極致尊榮。",
        description:
          "專為高階商務人士與節日送禮打造的頂級套裝。內含昔馬合金電動刮鬍刀、專屬訂製皮革防撞收納包，以及高質感清潔配件。威柏科技總代理品質承諾，提供最完善的一年原廠保固。",
        imgUrl: "/images/index/banner-05.png",
        reverse: false,
      },
    ],
  },
];

export default function SmasmallCollections() {
  return (
    <div className="w-full bg-[#f8f9fb] text-slate-900 font-sans selection:bg-blue-200 antialiased">
      <WaabiScrollIntro />

      <section className="w-full py-24 px-6 lg:px-16 max-w-[1600px] mx-auto bg-[#f5f5f7]">
        {/* 頂部橫向大標題 */}
        <div className="max-w-4xl mb-16">
          <Copy>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
              專注全合金電動刮鬍刀的
              <br />
              精品理容品牌
            </h2>
          </Copy>
          <Copy>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed tracking-wide">
              昔馬 SMASMALL 以全合金機身、磁吸刀頭與 IPX7 防水，
              <br />
              為注重質感與效率的男士，打造值得日常使用的理容器材。
            </p>
          </Copy>
        </div>

        {/* 下方左右內容：左側形象大圖，右側數據與敘述 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* 左側大圖 (光束延伸入空的情境) */}
          <div className="lg:col-span-7 relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-[url('/images/3d922fff-8ec9-4ec6-97b1-35b15933b297.png')] bg-cover bg-center" />
          </div>

          {/* 右側文字與數據面板 */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <Copy>
              {" "}
              <p className="text-gray-600 text-[14px] md:text-[15px] leading-relaxed mb-12">
                昔馬 SMASMALL
                由台灣總代理威柏科技原廠授權引進。我們相信電動刮鬍刀不只是消耗品，更是展現個人品味的日常配件——拋棄廉價塑膠機身，以重機與航空工業啟發的壓鑄合金，帶來更沉穩、更耐用的刮鬍體驗。
              </p>
            </Copy>

            {/* 核心數據網格佈局 */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-gray-200 pt-8">
              {CORE_STATS.map((stat, idx) => (
                <div key={idx} className={idx === 4 ? "col-span-2" : ""}>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: Brand Banner & Headquarters (參照 截圖 2.57.47 & 2.57.54)
          ==================================================================== */}
      <section className="w-full bg-white py-24 border-t border-b border-gray-200/60">
        <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-16">
          {/* Part A: 昔馬品牌旗艦視覺牆 */}
          <div className="mb-20">
            <Copy>
              {" "}
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                昔馬 SMASMALL
              </h3>
            </Copy>
            <Copy>
              {" "}
              <p className="text-stone-900 text-[16px] max-w-4xl leading-relaxed mb-8">
                專注於全合金機身與磁吸快拆刀頭，結合荷蘭進口精鋼刀網與 Type-C
                快充，讓居家、差旅與商務場合都能輕鬆完成刮鬍。威柏科技於台灣提供原廠授權銷售與售後服務，讓每位用戶買得安心、用得長久。
              </p>
            </Copy>

            <a
              href="/brand"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:underline"
            >
              <span>探索昔馬全系列產品</span>
              <ArrowRight size={14} />
            </a>
            {/* 品牌巨幅卡片 */}
            <div className="w-full h-[220px] md:h-[320px] bg-gradient-to-r from-blue-900 via-sky-800 to-blue-900 rounded-lg mt-8 flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_70%)]" />
              <div className="text-center z-10 text-white">
                <h2 className="text-4xl md:text-5xl font-extralight tracking-[0.3em]">
                  昔馬 SMASMALL
                </h2>
                <p className="text-[11px] tracking-[0.4em] opacity-60 mt-3">
                  威柏科技台灣總代理
                </p>
              </div>
            </div>
          </div>

          {/* Part B: 總代理威柏科技營運與現代化大樓 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-12 border-t border-gray-100">
            <div className="lg:col-span-5">
              <Copy>
                {" "}
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">
                  威柏科技有限公司
                </h4>
              </Copy>
              <Copy>
                {" "}
                <p className="text-stone-900 text-[16px] leading-relaxed">
                  威柏科技有限公司為昔馬 SMASMALL
                  台灣唯一官方授權總代理，負責原廠正品引進、通路管理與售後保固。透過線上商城與授權通路，提供產品諮詢、保固登錄與維修協助，讓用戶享有完整的購買與使用支援。
                </p>
              </Copy>
            </div>
            {/* 右側：宏偉的代理商現代化總部/工藝基地大樓 */}
            <div className="lg:col-span-7 h-[300px] md:h-[420px] relative rounded-lg overflow-hidden shadow-sm bg-gray-100">
              <div className="absolute inset-0 bg-[url('/images/2863f91d-4ff8-45c9-9c4c-f9a80a210e2d.png')] bg-cover bg-center" />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-24 px-6 lg:px-16 max-w-[1600px] mx-auto">
        <Copy>
          {" "}
          <h2 className="text-3xl font-bold text-gray-900 mb-12 tracking-tight">
            使命與願景
          </h2>
        </Copy>

        {/* 雙欄等寬卡片排版 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左卡片：Mission */}
          <div className="relative h-[320px] md:h-[400px] rounded-sm overflow-hidden bg-black flex flex-col justify-end p-8 md:p-12 group cursor-pointer shadow-md">
            <div className="absolute inset-0 bg-[url('/images/6c947c27-80f9-459d-ba4c-ef306388ac47.png')] bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="relative z-10 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">使命</h3>
              <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed max-w-sm">
                以全合金工藝與精密刀頭技術，讓每位男士都能享有順暢、舒適且值得信賴的刮鬍體驗。
              </p>
            </div>
          </div>

          {/* 右卡片：Vision */}
          <div className="relative h-[320px] md:h-[400px] rounded-sm overflow-hidden bg-black flex flex-col justify-end p-8 md:p-12 group cursor-pointer shadow-md">
            <div className="absolute inset-0 bg-[url('/images/5654d56c-22e5-40d5-814e-d76b00de6c2f.png')] bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="relative z-10 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">願景</h3>
              <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed max-w-sm">
                成為亞洲男士首選的全合金電動刮鬍刀品牌，讓高質感理容走進日常，也走進每一次出門前的自信時刻。
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center items-center pb-20">
        <div className="max-w-4xl border-t mx-auto border-gray-100 pt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">技術創新</h3>
          <p className="text-stone-900 text-[16px] md:text-base leading-relaxed mb-8">
            昔馬電動刮鬍刀結合全合金壓鑄機身、磁吸快拆刀頭、浮動刀網與 IPX7
            防水，並支援 Type-C
            快充。從刀頭材質到機身結構，每項設計都為更順手的刮鬍、清潔與攜帶而優化。
          </p>

          <div className="flex flex-wrap gap-3">
            {["全合金機身", "磁吸刀頭", "IPX7 防水", "Type-C 快充"].map(
              (tag, tIdx) => (
                <span
                  key={tIdx}
                  className="bg-[#f5f5f7] border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-full shadow-sm"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
      {/* <section className="w-full py-24 px-6 lg:px-16 max-w-[1400px] mx-auto">
        {PRODUCT_CATEGORIES.map((category, catIdx) => (
          <div key={catIdx} className="mb-24 last:mb-0">
           
            <div className="mb-12 border-b border-gray-200 pb-4">
              <p className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-2">
                {category.categoryTitle}
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                {category.categorySubtitle}
              </h2>
            </div>

         
            <div className="flex flex-col gap-12 md:gap-16">
              {category.products.map((product, prodIdx) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  key={prodIdx}
                  className={`flex flex-col ${product.reverse ? "md:flex-row-reverse" : "md:flex-row"} w-full bg-white border-gray-200 transition-shadow duration-500  overflow-hidden border border-gray-100 group`}
                >
               
                  <div className="w-full md:w-[55%] relative h-[300px] md:h-[450px] bg-[#f0f0f2] overflow-hidden">
                    <Image
                      src={product.imgUrl}
                      alt={product.name}
                      fill
                      className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>

                
                  <div className="w-full md:w-[45%] p-8 md:p-16 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                      {product.name}
                    </h3>

                    <div className="mb-10">
                      <p className="font-bold text-blue-600 text-sm md:text-base mb-4 tracking-wide">
                        {product.slogan}
                      </p>
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                  
                    <div>
                      <a
                        href={LINE_OFFICIAL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block border-2 border-gray-900 text-gray-900 px-8 py-3 text-sm font-bold hover:bg-gray-900 hover:text-white transition-colors duration-300 rounded-full"
                      >
                        進一步了解
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </section> */}
    </div>
  );
}
