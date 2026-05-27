"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import Image from "next/image";
import AccessoryRightPanel from "@/components/accessories/AccessoryRightPanel";

export default function AccessoryDetailClient({ productId }) {
  const params = useParams();
  const id = productId ?? params.id;
  const router = useRouter();
  const [product, setProduct] = useState(null);

  const [mainImgIdx, setMainImgIdx] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [carouselPaused, setCarouselPaused] = useState(false);

  const CAROUSEL_AUTOPLAY_MS = 5000;

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      const res = await fetch(`/api/accessories/${id}/detail`);
      if (!res.ok) {
        router.push("/accessories");
        return;
      }
      const targetProduct = await res.json();

      setProduct(targetProduct);
      setMainImgIdx(0);
      setSlideDirection(1);
      setActiveAccordion(null);

      if (!targetProduct.carouselFromFolders) {
        return;
      }

      try {
        const res = await fetch(`/api/accessories/${id}/carousel`);
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (cancelled || !data.images?.length) return;
        setProduct((prev) => (prev ? { ...prev, images: data.images } : prev));
        setMainImgIdx(0);
        setSlideDirection(1);
      } catch {
        /* 保留 imageFiles 預設圖 */
      }

      try {
        const infoRes = await fetch(
          `/api/accessories/${id}/product-info`,
        );
        if (!infoRes.ok || cancelled) return;
        const info = await infoRes.json();
        if (cancelled) return;
        setProduct((prev) =>
          prev
            ? {
                ...prev,
                shortDesc: info.shortDesc ?? prev.shortDesc,
                features: info.features?.length ? info.features : prev.features,
                details: info.details ?? prev.details,
                shipping: info.shipping ?? prev.shipping,
              }
            : prev,
        );
      } catch {
        /* 保留 catalog 預設文案 */
      }
    }

    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  const imageCount = product?.images?.length ?? 0;

  useEffect(() => {
    if (imageCount <= 1 || carouselPaused) return undefined;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return undefined;

    const timer = setInterval(() => {
      setSlideDirection(1);
      setMainImgIdx((prev) => (prev + 1) % imageCount);
    }, CAROUSEL_AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [imageCount, carouselPaused, product?.id]);

  if (!product) return <div className="min-h-screen bg-white"></div>;

  const toggleAccordion = (title) => {
    setActiveAccordion(activeAccordion === title ? null : title);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${i <= Math.round(rating) ? "text-[#00B4D8]" : "text-gray-200"}`}
        >
          ★
        </span>,
      );
    }
    return stars;
  };

  const goPrev = () => {
    setSlideDirection(-1);
    setMainImgIdx((prev) => (prev - 1 + imageCount) % imageCount);
  };

  const goNext = () => {
    setSlideDirection(1);
    setMainImgIdx((prev) => (prev + 1) % imageCount);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pt-[60px] lg:pt-[72px]">
      <div className="w-full border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-12 py-3.5 flex items-center gap-2 text-[13px] text-gray-500 font-medium">
          <button
            onClick={() => router.push("/")}
            className="hover:text-black transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => router.push("/accessories")}
            className="hover:text-black transition-colors"
          >
            Accessories
          </button>
          <span>/</span>
          <span className="text-gray-900 truncate">{product.title}</span>
        </div>
      </div>

      {/* 主區：左 50% 全高輪播 + 右 50% 商品資訊（參考 Vaonis 版型） */}
      <div className="w-full flex flex-col lg:flex-row lg:min-h-[calc(100vh-72px)]">
        <div
          className="group relative w-full h-[60vh] sm:h-[55vh] lg:w-1/2 lg:h-[calc(100vh-72px)] lg:sticky lg:top-[72px] shrink-0 overflow-hidden"
          onMouseEnter={() => setCarouselPaused(true)}
          onMouseLeave={() => setCarouselPaused(false)}
          onFocusCapture={() => setCarouselPaused(true)}
          onBlurCapture={() => setCarouselPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${mainImgIdx}-${slideDirection}`}
              initial={{
                clipPath:
                  slideDirection > 0
                    ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
                    : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
              }}
              animate={{
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              }}
              exit={{
                clipPath:
                  slideDirection > 0
                    ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
                    : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
              }}
              transition={{
                duration: 0.85,
                ease: [0.071, 0.505, 0.318, 0.852],
              }}
              className="absolute inset-0"
            >
              <motion.div
                initial={{ x: slideDirection > 0 ? 180 : -180 }}
                animate={{ x: 0 }}
                exit={{ x: slideDirection > 0 ? -180 : 180 }}
                transition={{
                  duration: 0.85,
                  ease: [0.071, 0.505, 0.318, 0.852],
                }}
                className="w-full h-full"
              >
                <Image
                  src={product.images[mainImgIdx]}
                  alt={`${product.title} ${mainImgIdx + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {imageCount > 1 && (
            <>
              <div className="absolute inset-x-4 lg:inset-x-6 top-1/2 -translate-y-1/2 flex justify-between z-10 pointer-events-none">
                <button
                  type="button"
                  onClick={goPrev}
                  className="pointer-events-auto w-10 h-10 rounded-full bg-black/35 hover:bg-black/50 text-white backdrop-blur-sm flex items-center justify-center transition-colors"
                  aria-label="上一張"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="pointer-events-auto w-10 h-10 rounded-full bg-black/35 hover:bg-black/50 text-white backdrop-blur-sm flex items-center justify-center transition-colors"
                  aria-label="下一張"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              <div className="absolute bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (idx === mainImgIdx) return;
                      setSlideDirection(idx > mainImgIdx ? 1 : -1);
                      setMainImgIdx(idx);
                    }}
                    aria-label={`第 ${idx + 1} 張`}
                    className={`transition-all duration-300 rounded-full shadow-sm ${
                      mainImgIdx === idx
                        ? "w-8 h-1.5 bg-[#00B4D8]"
                        : "w-1.5 h-1.5 bg-white/80 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="w-full lg:w-1/2 bg-white">
          <div className="px-5 py-8 lg:px-12 lg:py-16 pb-16 lg:pb-24">
            <h1 className="text-2xl md:text-[2.5rem] font-bold text-gray-900 leading-tight mb-3 tracking-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex tracking-widest">
                {renderStars(product.rating)}
              </div>
              <span className="text-[13px] text-gray-500 font-medium pt-0.5">
                {product.reviews} reviews
              </span>
            </div>

            <p className="text-[15px] text-gray-600 leading-relaxed font-medium mb-10">
              {product.shortDesc}
            </p>

            <div className="w-full border-t border-gray-200">
              {product.features.map((feature, idx) => {
                const isOpen = activeAccordion === feature.title;
                return (
                  <div key={idx} className="border-b border-gray-200">
                    <button
                      onClick={() => toggleAccordion(feature.title)}
                      className="w-full py-5 lg:py-6 flex items-center justify-between text-left group"
                    >
                      <span
                        className={`text-[15px] lg:text-[16px] font-bold tracking-wide transition-colors ${isOpen ? "text-black" : "text-gray-800 group-hover:text-black"}`}
                      >
                        {feature.title}
                      </span>
                      <span className="text-gray-400 group-hover:text-black transition-colors">
                        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                      </span>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-6 lg:pb-8 text-[14px] text-gray-600 leading-relaxed pr-6">
                            {feature.content}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleAccordion("details")}
                  className="w-full py-5 lg:py-6 flex items-center justify-between text-left group"
                >
                  <span
                    className={`text-[15px] lg:text-[16px] font-bold tracking-wide transition-colors ${activeAccordion === "details" ? "text-black" : "text-gray-800 group-hover:text-black"}`}
                  >
                    產品規格與細節
                  </span>
                  <span className="text-gray-400 group-hover:text-black transition-colors">
                    {activeAccordion === "details" ? (
                      <Minus size={20} />
                    ) : (
                      <Plus size={20} />
                    )}
                  </span>
                </button>
                <AnimatePresence>
                  {activeAccordion === "details" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 lg:pb-8 text-[14px] text-gray-600 leading-relaxed pr-6 whitespace-pre-line">
                        {product.details}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full py-5 lg:py-6 flex items-center justify-between text-left group"
                >
                  <span
                    className={`text-[15px] lg:text-[16px] font-bold tracking-wide transition-colors ${activeAccordion === "shipping" ? "text-black" : "text-gray-800 group-hover:text-black"}`}
                  >
                    配送與售後服務
                  </span>
                  <span className="text-gray-400 group-hover:text-black transition-colors">
                    {activeAccordion === "shipping" ? (
                      <Minus size={20} />
                    ) : (
                      <Plus size={20} />
                    )}
                  </span>
                </button>
                <AnimatePresence>
                  {activeAccordion === "shipping" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 lg:pb-8 text-[14px] text-gray-600 leading-relaxed pr-6">
                        {product.shipping}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-200">
              <button className="bg-[#00B4D8] hover:bg-[#0096B4] text-white px-8 md:px-12 py-3 rounded-full font-bold text-[15px] transition-colors shadow-lg shadow-cyan-500/30 w-full sm:w-auto">
                前往購買
              </button>
            </div>

            <AccessoryRightPanel panel={product.rightPanel} />

            {product.scenarioImages?.length > 0 && (
              <section className="mt-14 lg:mt-20 border-t border-gray-100 pt-14 lg:pt-20">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                  使用情境
                </h2>
                <p className="text-[14px] text-gray-500 mb-8">
                  實際使用與生活情境展示
                </p>
                <div className="flex flex-col gap-4">
                  {product.manualGuide?.imageUrl &&
                    product.manualGuide?.pdfUrl && (
                      <a
                        href={product.manualGuide.pdfUrl}
                        download
                        className="relative w-full overflow-hidden block group"
                        title={product.manualGuide.label || "下載產品說明書"}
                      >
                        <Image
                          src={product.manualGuide.imageUrl}
                          alt={product.manualGuide.label || "產品說明書"}
                          width={800}
                          height={500}
                          className="w-full h-auto object-cover"
                        />
                      </a>
                    )}
                  {product.scenarioImages.map((src, idx) => (
                    <div key={src} className="relative w-full overflow-hidden ">
                      <Image
                        src={src}
                        alt={`${product.title} 情境圖 ${idx + 1}`}
                        width={800}
                        height={500}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
