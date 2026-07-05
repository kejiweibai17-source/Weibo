"use client";

import Image from "next/image";

export default function SeriesSpecsPanel({
  title = "產品規格",
  note,
  leftImage,
  rightImage,
}) {
  if (!leftImage && !rightImage) return null;

  const showHeader = Boolean(title && title !== "產品規格") || Boolean(note);

  return (
    <section className="bg-[#050507] px-4 pb-16 md:px-8 md:pb-24">
      <div className="mx-auto max-w-[1420px]">
        {showHeader ? (
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            {title ? (
              <h2 className="text-3xl font-bold text-white md:text-4xl">{title}</h2>
            ) : null}
            {note ? (
              <p className="max-w-xl text-sm text-white/60">{note}</p>
            ) : null}
          </div>
        ) : null}

        <div className="mx-auto grid w-[95%] grid-cols-1 sm:w-[80%] md:grid-cols-2 xl:w-[70%]">
          {leftImage ? (
            <div className="p-3">
              <Image
                src={leftImage}
                alt={`${title} 左欄`}
                width={1000}
                height={1000}
                className="h-auto w-full"
                unoptimized
              />
            </div>
          ) : null}
          {rightImage ? (
            <div className="p-3">
              <Image
                src={rightImage}
                alt={`${title} 右欄`}
                width={1000}
                height={1000}
                className="h-auto w-full"
                unoptimized
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
