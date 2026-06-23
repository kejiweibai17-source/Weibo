"use client";

import { useMemo, useState } from "react";
import { Link } from "next-view-transitions";
import { Clock, ExternalLink, MapPin, Phone, Search } from "lucide-react";
import {
  filterRetailStores,
  getRetailStoreCities,
  getStoreMapsUrl,
  getStoresGroupedByRegion,
} from "@/data/retailStores";

const STORE_HIGHLIGHTS = [
  "WEiZ 為昔馬台灣總代理威柏科技旗下實體選物品牌",
  "門市可試用、選購昔馬 SMASMALL 電動刮鬍刀與配件",
  "建議前往前致電門市，確認款式與庫存",
];

export default function StoresClient({ stores }) {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");

  const cityOptions = useMemo(() => getRetailStoreCities(stores), [stores]);

  const filteredStores = useMemo(
    () => filterRetailStores(stores, { keyword, city }),
    [stores, keyword, city],
  );

  const groups = useMemo(
    () => getStoresGroupedByRegion(filteredStores),
    [filteredStores],
  );

  const hasActiveFilters = keyword.trim() !== "" || city !== "";

  return (
    <div className="w-full min-h-screen bg-[#EDEEEF] font-sans antialiased pt-[60px] lg:pt-[72px]">
      <nav
        aria-label="breadcrumb"
        className="mx-auto max-w-[960px] px-6 pt-8 pb-2 text-[12px] text-gray-500"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-gray-900 transition-colors">
              首頁
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-gray-900">全台門市</li>
        </ol>
      </nav>

      <section className="mx-auto max-w-[960px] px-6 py-8 md:py-12">
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
          <div className="px-6 py-8 md:px-10 md:py-10 border-b border-gray-100">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#00B4D8] mb-3">
              Store Locator
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-4">
              全台門市據點
            </h1>
            <p className="text-[14px] md:text-[15px] text-gray-600 leading-relaxed max-w-2xl">
              以下為目前可購買或體驗昔馬 SMASMALL 電動刮鬍刀之實體門市。點選「Google
              地圖」可查看位置與規劃路線。
            </p>
            <ul className="mt-6 space-y-2.5">
              {STORE_HIGHLIGHTS.map((line) => (
                <li
                  key={line}
                  className="flex gap-3 text-[13px] md:text-[14px] text-gray-700 leading-relaxed"
                >
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#00B4D8]" />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="px-6 py-6 md:px-10 border-b border-gray-100 bg-[#f8f9fa]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <label className="relative flex-1">
                <span className="sr-only">關鍵字搜尋</span>
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-hidden
                />
                <input
                  type="search"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="搜尋門市名稱、地址、品牌…"
                  className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-[14px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20"
                />
              </label>

              <label className="md:w-[200px]">
                <span className="sr-only">縣市篩選</span>
                <select
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="w-full appearance-none rounded-full border border-gray-200 bg-white py-3 px-4 text-[14px] text-gray-900 outline-none transition-colors focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20"
                >
                  <option value="">全部縣市</option>
                  {cityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-gray-500">
              <span>
                共 {filteredStores.length} 間門市
                {hasActiveFilters ? "（已篩選）" : ""}
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setKeyword("");
                    setCity("");
                  }}
                  className="font-medium text-[#00B4D8] hover:underline"
                >
                  清除篩選
                </button>
              )}
            </div>
          </div>

          <div className="px-6 py-8 md:px-10 md:py-10 space-y-10">
            {groups.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-[#fafafa] px-6 py-12 text-center">
                <p className="text-[15px] font-medium text-gray-700 mb-2">
                  找不到符合條件的門市
                </p>
                <p className="text-[13px] text-gray-500">
                  請調整關鍵字或縣市篩選後再試一次。
                </p>
              </div>
            ) : (
              groups.map(({ region, stores }) => (
                <div key={region}>
                  <h2 className="text-[13px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-4">
                    {region}
                  </h2>
                  <ul className="space-y-4">
                    {stores.map((store) => (
                      <li
                        key={store.id}
                        className="rounded-xl border border-gray-100 bg-[#fafafa] p-5 md:p-6 hover:border-gray-200 hover:bg-white transition-colors"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="inline-flex items-center rounded-full bg-[#00B4D8]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#0077a3]">
                                {store.brand}
                              </span>
                              <span className="text-[12px] text-gray-400">
                                {store.city}
                              </span>
                            </div>
                            <h3 className="text-[17px] md:text-[18px] font-bold text-gray-900 mb-3">
                              {store.name}
                            </h3>

                            <ul className="space-y-2.5 text-[14px] text-gray-600">
                              <li className="flex items-start gap-2.5">
                                <MapPin
                                  size={16}
                                  className="mt-0.5 shrink-0 text-gray-400"
                                  aria-hidden
                                />
                                <span>{store.address}</span>
                              </li>
                              <li className="flex items-center gap-2.5">
                                <Phone
                                  size={16}
                                  className="shrink-0 text-gray-400"
                                  aria-hidden
                                />
                                <a
                                  href={`tel:${store.phone.replace(/-/g, "")}`}
                                  className="hover:text-[#00B4D8] transition-colors"
                                >
                                  {store.phone}
                                </a>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <Clock
                                  size={16}
                                  className="mt-0.5 shrink-0 text-gray-400"
                                  aria-hidden
                                />
                                <span>{store.hours}</span>
                              </li>
                            </ul>

                            {store.note && (
                              <p className="mt-3 text-[12px] text-gray-400 leading-relaxed">
                                {store.note}
                              </p>
                            )}
                          </div>

                          <a
                            href={getStoreMapsUrl(store)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-gray-800 transition-colors w-full md:w-auto"
                          >
                            Google 地圖
                            <ExternalLink size={14} aria-hidden />
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>

          <div className="px-6 py-6 md:px-10 border-t border-gray-100 bg-[#f8f9fa] rounded-b-2xl">
            <p className="text-[12px] text-gray-500 leading-relaxed">
              門市資訊整理自 WEiZ 官方 LINE 櫃位據點與 JC科技官網，實際營業時間、品項與庫存請以各門市公告為準。亦可透過{" "}
              <Link
                href="/contact"
                className="text-[#00B4D8] hover:underline"
              >
                聯絡我們
              </Link>{" "}
              或 LINE 官方帳號 @weibo 洽詢。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
