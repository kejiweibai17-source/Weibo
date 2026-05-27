"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Contact from "@/components/ContactSection";
// ============================================================================
// 昔馬 SMASMALL 真實產品系列資料設定 (全繁體中文在地化)
// ============================================================================
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
        imgUrl: "/images/3d922fff-8ec9-4ec6-97b1-35b15933b297.png", // 替換為 S1 產品圖
        reverse: false, // 圖片在左
      },
      {
        name: "昔馬 S3 小金剛旗艦版",
        slogan: "極致動力，無懈可擊。",
        description:
          "專為追求極致效能的男士打造。內建升級版毫秒級高速抗震低噪馬達，動力澎湃。搭配業界首創「磁吸式快拆刀頭」，一秒拆卸無縫貼合，徹底解決傳統卡榫易斷裂問題，清潔保養毫不費力。",
        imgUrl: "/images/6c947c27-80f9-459d-ba4c-ef306388ac47.png", // 替換為 S3 產品圖
        reverse: true, // 圖片在右
      },
      {
        name: "昔馬 S1-DK 黑夜騎士",
        slogan: "深邃暗黑，硬派美學。",
        description:
          "延續 S1 經典架構，披上極致深邃的消光黑夜塗裝。專為低調且注重質感的都會男士設計，每一處細節都散發著復古未來主義的獨特魅力，是展現個人風格的最佳桌面理容藝術品。",
        imgUrl: "/images/5654d56c-22e5-40d5-814e-d76b00de6c2f.png", // 替換為黑夜騎士版產品圖
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
        imgUrl: "/images/002.png", // 替換為禮盒組產品圖
        reverse: false,
      },
    ],
  },
];

export default function SmasmallCollections() {
  return (
    <div className=" ">
      <Contact />
    </div>
  );
}
