"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
// 🌟 1. 引入 next-view-transitions 的 Link
import { Link } from "next-view-transitions";

// ============================================================================
// 🛒 昔馬商品配件資料
// ============================================================================
const PRODUCTS = [
  {
    id: "p1",
    title: "捍衛者全合金戰損刮鬍刀 (旗艦主機)",
    price: 2480,
    compatibility: ["Defender"],
    category: "Misc",
    images: ["/images/捍衛者/捍衛者-01.png"],
  },
  {
    id: "p2",
    title: "雙環開放式浮動圓刀頭 (二入組)",
    price: 480,
    compatibility: ["Defender", "S1"],
    category: "Blade",
    images: ["/images/捍衛者/捍衛者-02.png", "/images/捍衛者/捍衛者-03.png"],
  },
  {
    id: "p3",
    title: "磁吸式戰術鬢角修剪器",
    price: 350,
    compatibility: ["Defender"],
    category: "Grooming",
    images: ["/images/捍衛者/捍衛者-03.png", "/images/捍衛者/捍衛者-01.png"],
  },
  {
    id: "p4",
    title: "軍規高抗震型全合金機身底座",
    price: 550,
    compatibility: ["Defender"],
    category: "Misc",
    images: ["/images/捍衛者/捍衛者-04.png"],
  },
  {
    id: "p5",
    title: "無痛立體鼻毛修剪刀頭",
    price: 350,
    compatibility: ["Defender", "S1"],
    category: "Grooming",
    images: ["/images/捍衛者/捍衛者-05.png"],
  },
  {
    id: "p6",
    title: "精鋼自研磨深層淨容刀頭",
    price: 480,
    compatibility: ["Defender", "S3"],
    category: "Blade",
    images: ["/images/捍衛者/捍衛者-06.png"],
  },
  {
    id: "p7",
    title: "專屬戰術防撞旅行盒 (鋼鐵灰)",
    price: 580,
    compatibility: ["Defender", "S3"],
    category: "Case",
    images: ["/images/捍衛者/捍衛者-07.png"],
  },
];

const COMPATIBILITY_OPTIONS = [
  { label: "All", value: "All" },
  { label: "捍衛者 Defender", value: "Defender" },
  { label: "S1 經典版", value: "S1" },
  { label: "S3 旗艦版", value: "S3" },
];

const CATEGORY_OPTIONS = [
  { label: "All", value: "All" },
  { label: "替換刀頭 (Blades)", value: "Blade" },
  { label: "收納包殼 (Cases)", value: "Case" },
  { label: "理容配件 (Grooming)", value: "Grooming" },
  { label: "其他周邊 (Misc)", value: "Misc" },
];

export default function AccessoriesPage() {
  const [activeComp, setActiveComp] = useState("All");
  const [activeCats, setActiveCats] = useState(["All"]);

  const handleCategoryToggle = (value) => {
    if (value === "All") {
      setActiveCats(["All"]);
      return;
    }

    setActiveCats((prev) => {
      let newCats = prev.includes("All") ? [] : [...prev];
      if (newCats.includes(value)) {
        newCats = newCats.filter((c) => c !== value);
        if (newCats.length === 0) return ["All"];
        return newCats;
      } else {
        return [...newCats, value];
      }
    });
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchComp =
        activeComp === "All" || product.compatibility.includes(activeComp);
      const matchCat =
        activeCats.includes("All") || activeCats.includes(product.category);
      return matchComp && matchCat;
    });
  }, [activeComp, activeCats]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pt-32 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* 標題區塊 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl leading-tight text-gray-900">
            探索專屬配件，
            <br className="hidden md:block" />
            將您的昔馬理容體驗提升至全新境界。
          </h1>
          <button className="md:hidden flex items-center gap-2 text-sm font-medium border border-gray-300 px-4 py-2 rounded-full">
            <SlidersHorizontal size={16} /> 篩選
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* 左側 Sidebar 篩選區 */}
          <aside className="w-full md:w-[250px] flex-shrink-0 sticky top-32 hidden md:block">
            {/* 1. 適用型號 */}
            <div className="mb-10">
              <h3 className="font-bold text-[15px] mb-5 text-gray-900">
                Product compatibility
              </h3>
              <ul className="space-y-3">
                {COMPATIBILITY_OPTIONS.map((opt) => {
                  const isActive = activeComp === opt.value;
                  return (
                    <li
                      key={opt.value}
                      className="relative flex items-center cursor-pointer group"
                      onClick={() => setActiveComp(opt.value)}
                    >
                      <span
                        className={`absolute -left-4 w-1.5 h-1.5 rounded-full bg-[#007aff] transition-opacity duration-300 ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <span
                        className={`text-[14px] transition-colors ${
                          isActive
                            ? "text-gray-900 font-medium"
                            : "text-gray-500 group-hover:text-gray-800"
                        }`}
                      >
                        {opt.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 2. 配件分類 */}
            <div>
              <h3 className="font-bold text-[15px] mb-5 text-gray-900">
                Categories
              </h3>
              <ul className="space-y-3">
                {CATEGORY_OPTIONS.map((opt) => {
                  const isChecked = activeCats.includes(opt.value);
                  return (
                    <li
                      key={opt.value}
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => handleCategoryToggle(opt.value)}
                    >
                      <div
                        className={`w-[14px] h-[14px] rounded-[3px] border flex items-center justify-center transition-colors ${
                          isChecked
                            ? "bg-[#007aff] border-[#007aff]"
                            : "border-gray-300 group-hover:border-gray-500"
                        }`}
                      >
                        {isChecked && (
                          <div className="w-1.5 h-1.5 bg-white rounded-sm" />
                        )}
                      </div>
                      <span
                        className={`text-[14px] transition-colors ${
                          isChecked
                            ? "text-gray-900 font-medium"
                            : "text-gray-500 group-hover:text-gray-800"
                        }`}
                      >
                        {opt.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* 右側商品網格區 */}
          <div className="w-full flex-1">
            <div className="flex justify-end mb-6 hidden md:flex">
              <SlidersHorizontal size={20} className="text-gray-400" />
            </div>

            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  // 🌟 2. 終極修復：移除註解，使用 motion 元件包裝 Link 作為根節點
                  // 這樣 Framer Motion 的 Layout 動畫能正常運作，Link 的點擊路由也能 100% 生效！
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    key={product.id}
                  >
                    <Link
                      href={`/accessories/${product.id}`}
                      className="block h-full cursor-pointer"
                    >
                      <ProductCard product={product} />
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full py-20 text-center text-gray-500"
              >
                找不到符合條件的配件。
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 單一商品卡片元件 (僅負責 UI 與圖片輪播邏輯)
// ============================================================================
function ProductCard({ product }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const hasMultipleImages = product.images.length > 1;

  // 🌟 3. 防呆機制：阻止箭頭點擊事件向外傳遞給外層的 Link
  const nextImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((prev) => (prev + 1) % product.images.length);
  };

  const prevImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    );
  };

  return (
    <div
      className="group flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setImgIdx(0);
      }}
    >
      <div className="relative w-full aspect-square bg-[#f5f5f7] mb-5 overflow-hidden rounded-sm flex items-center justify-center">
        <motion.img
          key={imgIdx}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={product.images[imgIdx]}
          alt={product.title}
          className="w-[75%] h-[75%] object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
        />

        {hasMultipleImages && (
          <div
            className={`absolute inset-0 flex items-center justify-between px-3 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <button
              onClick={prevImg}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center text-gray-800 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextImg}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center text-gray-800 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <h3 className="text-[15px] font-bold text-gray-900 leading-snug mb-1.5 group-hover:text-[#007aff] transition-colors">
        {product.title}
      </h3>
      <p className="text-[14px] text-gray-600 font-medium">
        NT$ {product.price}
      </p>
    </div>
  );
}
