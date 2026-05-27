"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { Link } from "next-view-transitions";
import Copy from "@/components/Copy";
import { COMPATIBILITY_OPTIONS, CATEGORY_OPTIONS } from "@/data/accessories";

export default function AccessoriesPageClient({ products }) {
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
    return products.filter((product) => {
      const matchComp =
        activeComp === "All" || product.compatibility.includes(activeComp);
      const matchCat =
        activeCats.includes("All") || activeCats.includes(product.category);
      return matchComp && matchCat;
    });
  }, [products, activeComp, activeCats]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pt-32 pb-32">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <Copy>
            {" "}
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl leading-tight text-gray-900">
              探索專屬配件，
              <br className="hidden md:block" />
              將您的昔馬理容體驗提升至全新境界。
            </h1>
          </Copy>

          <button className="md:hidden flex items-center gap-2 text-sm font-medium border border-gray-300 px-4 py-2 rounded-full">
            <SlidersHorizontal size={16} /> 篩選
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          <aside className="w-full md:w-[250px] flex-shrink-0 sticky top-32 hidden md:block">
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

          <div className="w-full flex-1">
            <div className="flex justify-end mb-6 hidden md:flex">
              <SlidersHorizontal size={20} className="text-gray-400" />
            </div>

            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-12"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
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

function ProductCard({ product }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const hasMultipleImages = product.images.length > 1;

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

      <h3 className="text-[15px] font-bold text-gray-900 leading-snug group-hover:text-[#007aff] transition-colors">
        {product.title}
      </h3>
    </div>
  );
}
