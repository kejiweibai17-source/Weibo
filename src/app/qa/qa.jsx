"use client";

import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- 手風琴動畫變體 (Framer Motion) ---
const accordionVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

// --- 手風琴單個項目元件 ---
const AccordionItem = ({ question, answer, isActive, onClick, id }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm mb-5 overflow-hidden transition-all duration-300">
      <button
        type="button"
        className="w-full flex items-center justify-between p-6 sm:p-8 text-left focus:outline-none"
        onClick={onClick}
        aria-expanded={isActive}
        aria-controls={`accordion-content-${id}`}
      >
        <span className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 pr-6">
          {question}
        </span>
        <span className="flex-shrink-0 grid h-10 w-10 place-items-center rounded-full border border-gray-100 bg-gray-50 text-blue-600 shadow-inner">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className={`transition-transform duration-300 ${isActive ? "rotate-180" : "rotate-0"}`}
          >
            {isActive ? (
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            id={`accordion-content-${id}`}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={accordionVariants}
          >
            <div className="px-6 sm:px-8 pb-8">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl whitespace-pre-line">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const QAPage = () => {
  // 控制當前展開的手風琴項目的 ID
  const [activeId, setActiveId] = useState(null);

  // 切換手風琴項目的狀態
  const toggleAccordion = (id) => {
    setActiveId((prevId) => (prevId === id ? null : id));
  };

  // --- 問答資料 ---
  const faqData = [
    {
      id: "q1",
      question: '"街口eSIM" 提供的方案可以使用通話或簡訊嗎？',
      answer:
        "不可以，目前僅提供純上網（數據傳輸）功能，不支援傳統語音通話及簡訊（SMS）。不過，您可以使用應用程式（例如：LINE、WhatsApp、微信、Skype 等）進行語音或視訊通話。",
    },
    {
      id: "q2",
      question: '我該如何確認我的手機可以使用 "街口eSIM"？',
      answer:
        "您可以使用以下方式進行確認：\n1. 前往產品方案頁面，查看「適用機型」列表。\n2. 查詢原廠規格：前往您手機品牌的官方網站或查閱規格表。\n3. 通常，支援 eSIM 的機型會在網路或 SIM 卡規格中明確標示「支援 eSIM」或「具備 eSIM 功能」。\n4. 手機直撥代碼：於通話介面直撥代碼「*#06#」，查看是否出現 EID（支援 eSIM 的 EID 通常會有 32 位數字）。\n若仍不確定，建議聯絡手機原廠或電信業者進行諮詢。",
    },
    {
      id: "q3",
      question: "我該如何確認我是否成功安裝並開啟 eSIM？",
      answer:
        "您可以使用以下方式進行確認：\n1. 查看信號欄：抵達該國家後，開啟 eSIM 並確認其已選擇正確的信號源。若成功連結，信號欄旁將顯示信號強弱。\n2. 確認行動數據設定：前往手機「設定」>「行動服務」/「行動網路」>「行動數據」，確認已選取 eSIM 作為「主要行動數據」。",
    },
    {
      id: "q4",
      question: "當抵達目的地後該後來使用？數據漫遊需要開啟嗎？",
      answer:
        "由於街口eSIM是使用海外漫遊漫遊到您的目的地，所以必須開啟「數據漫遊」，並且在您選取正確信號源，以及將該 eSIM 啟用為您的數據源。",
    },
  ];

  return (
    <>
      <Head>
        <title>常見問題 - 街口eSIM</title>
      </Head>

      {/* --- 上方 Hero Section --- */}
      <section className="bg-gray-50 py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute right-[-10%] top-[-15%] w-[130%] h-[130%] bg-white rounded-full opacity-60 filter blur-3xl z-0" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-[62%_38%] items-center gap-16">
            {/* 左側內容 */}
            <div className="lg:pr-12 text-center lg:text-left">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-5 py-1.5 text-sm font-semibold text-gray-700 mb-6 shadow-inner">
                Q&A Page
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-950 mb-7">
                常見問題
              </h1>
              <p className="text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                我們收集了用戶常見的問題與解答，幫助您快速了解
              </p>
            </div>

            {/* 右側圖片區塊 (含 Hover 效果) */}
            <div className="flex justify-center lg:justify-end relative">
              <div className="absolute inset-0 m-auto aspect-square w-[92%] bg-white rounded-full -z-10 shadow-lg border border-gray-100" />

              <motion.div
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex justify-center"
              >
                <Image
                  src="/images/qa/qa-hero.png"
                  alt="常見問題 Hero Image"
                  width={300}
                  height={400}
                  className="object-contain"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 下方 Accordion Section --- */}
      <section className="bg-gray-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section 標題 */}
          <div className="text-center mb-20 lg:mb-24 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-950 mb-7">
              常見問題
            </h2>
            <p className="text-2xl text-gray-600">這裡有用戶詢問的最熱門問題</p>
          </div>

          {/* 手風琴列表 */}
          <div className="max-w-5xl mx-auto">
            {faqData.map((item) => (
              <AccordionItem
                key={item.id}
                question={item.question}
                answer={item.answer}
                isActive={activeId === item.id}
                onClick={() => toggleAccordion(item.id)}
                id={item.id}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default QAPage;
