"use client";

import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Copy from "@/components/Copy";
export default function ContactSection() {
  return (
    <section className="w-full min-h-screen bg-white text-black flex flex-col lg:flex-row font-sans">
      {/* =========================================================
          左側：滿版產品情境圖
          ========================================================= */}
      <div className="w-full lg:w-[45%] relative min-h-[40vh] lg:min-h-screen bg-gray-100">
        {/* 記得將 src 替換為你實際要放的左側產品圖路徑 */}
        <Image
          src="/images/7c01c62f-c36b-41af-a2e9-2d499a0bc218.png"
          alt="Contact Product"
          fill
          className="object-cover object-center"
        />
      </div>

      {/* =========================================================
          右側：聯絡表單區域
          ========================================================= */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 md:p-16 lg:p-20 xl:px-28">
        <div className="w-full max-w-xl">
          {/* 標題區 */}
          <div className="mb-14">
            <Copy>
              {" "}
              <h2 className="text-4xl md:text-5xl lg:text-[44px] font-medium text-gray-900 leading-tight tracking-tight mb-1">
                告訴我們您的需求。
              </h2>
            </Copy>
            <Copy>
              {" "}
              <h3 className="text-4xl md:text-5xl lg:text-[40px] font-light text-stone-800 leading-tight tracking-tight">
                讓我們與您聯繫。
              </h3>
            </Copy>
          </div>

          {/* 表單區 */}
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            {/* 1. Contact (Email) */}
            <div>
              <label className="block text-[15px] font-bold text-gray-900 mb-3 tracking-wide">
                聯絡信箱
              </label>
              <input
                type="email"
                placeholder="請輸入您的電子郵件"
                className="w-full border border-gray-300 rounded-md px-4 py-3.5 text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors bg-white"
              />
            </div>

            {/* 2. You are (身分與詳細資料) */}
            <div className="space-y-4">
              <label className="block text-[15px] font-bold text-gray-900 mb-3 tracking-wide">
                您的身分
              </label>

              {/* 下拉選單 */}
              <div className="relative">
                <select className="w-full border border-gray-300 rounded-md px-4 py-3.5 text-[15px] text-gray-500 appearance-none focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors bg-white cursor-pointer">
                  <option value="" disabled selected>
                    請選擇選項...
                  </option>
                  <option value="individual">個人</option>
                  <option value="company">公司 / 企業</option>
                  <option value="other">其他</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
              </div>

              {/* 組織名稱 */}
              <input
                type="text"
                placeholder="公司 / 機構名稱"
                className="w-full border border-gray-300 rounded-md px-4 py-3.5 text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors bg-white"
              />

              {/* 姓名雙欄 (調整為中文習慣：先姓再名) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="姓氏"
                  className="w-full border border-gray-300 rounded-md px-4 py-3.5 text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors bg-white"
                />
                <input
                  type="text"
                  placeholder="名字"
                  className="w-full border border-gray-300 rounded-md px-4 py-3.5 text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors bg-white"
                />
              </div>

              {/* 電話輸入 (帶國碼選擇) */}
              <div className="flex border border-gray-300 rounded-md overflow-hidden focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500 transition-colors bg-white">
                <div className="bg-gray-50 border-r border-gray-300 px-3 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-gray-100 transition-colors">
                  {/* 換成台灣國旗 */}
                  <span className="text-lg leading-none">🇹🇼</span>
                  <ChevronDown size={14} className="text-gray-500" />
                </div>
                <input
                  type="tel"
                  placeholder="聯絡電話"
                  className="flex-1 px-4 py-3.5 text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* 3. Your message (留言區塊) */}
            <div>
              <label className="block text-[15px] font-bold text-gray-900 mb-3 tracking-wide">
                您的留言
              </label>
              <textarea
                rows={4}
                placeholder="請輸入您的訊息..."
                className="w-full border border-gray-300 rounded-md px-4 py-3.5 text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors bg-white resize-none"
              ></textarea>
            </div>

            {/* 4. Checkbox (訂閱同意) */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="subscribe"
                className="mt-1 w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer"
              />
              <label
                htmlFor="subscribe"
                className="text-[14px] text-gray-600 cursor-pointer leading-snug"
              >
                我同意接收昔馬 SMASMALL 的最新消息與行銷優惠資訊。
              </label>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
