import Image from "next/image";
import gsap from "gsap";

export const CONSTELLATION = "/images/accessories/星座系列電動刮鬍刀禮盒";

export const ELEMENT_CARDS = [
  {
    label: "FIRE SIGNS",
    sub: "火象星座",
    src: `${CONSTELLATION}/主圖_火象.jpg`,
  },
  {
    label: "AIR SIGNS",
    sub: "風象星座",
    src: `${CONSTELLATION}/主圖_風象.jpg`,
  },
  {
    label: "EARTH SIGNS",
    sub: "土象星座",
    src: `${CONSTELLATION}/主圖_土象.jpg`,
  },
  {
    label: "WATER SIGNS",
    sub: "水象星座",
    src: `${CONSTELLATION}/主圖_水象.jpg`,
  },
];

export function SlideDiscover() {
  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="reveal-line mb-5 text-3xl font-semibold tracking-tight text-white drop-shadow-md sm:text-4xl md:text-5xl lg:text-6xl">
        探索屬於你的星座
      </h2>
      <p className="reveal-line text-sm font-light tracking-wide text-white/85 sm:text-base md:text-lg">
        四象限定 · 星座系列電動刮鬍刀
      </p>
    </div>
  );
}

export function SlideFourElements() {
  return (
    <div className="flex w-full max-w-5xl flex-col items-center px-4">
      <p className="reveal-line mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-white/75 sm:text-xs">
        SMASMALL 昔馬 · Four Elements
      </p>
      <h2 className="reveal-line text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
        星座系列
      </h2>
      <h2 className="reveal-line mb-4 text-2xl font-semibold tracking-tight text-amber-200 drop-shadow-sm sm:text-3xl md:text-4xl lg:text-5xl">
        電動刮鬍刀禮盒
      </h2>
      <p className="reveal-line mb-8 text-sm font-light tracking-[0.2em] text-white/80 sm:text-base">
        火 · 風 · 土 · 水　四象限定
      </p>

      <div className="reveal-line grid w-full max-w-3xl grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {ELEMENT_CARDS.map((card) => (
          <div key={card.label} className="flex flex-col items-center gap-2">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-black/20">
              <Image
                src={card.src}
                alt={card.sub}
                fill
                sizes="(max-width: 768px) 22vw, 160px"
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-[8px] font-medium uppercase tracking-wider text-white/90 sm:text-[10px]">
                {card.label}
              </p>
              <p className="text-[9px] text-white/55 sm:text-[11px]">
                {card.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SlideBornSharp() {
  const features = ["磁吸快拆刀網", "荷蘭進口鍍鋼刀片", "IPX7 全機防水"];

  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-8 px-4 md:flex-row md:items-center md:justify-between md:gap-10 lg:gap-16">
      <div className="reveal-line flex shrink-0 items-end justify-center gap-4 sm:gap-5 md:gap-6">
        <div className="relative h-48 w-28 sm:h-56 sm:w-32 md:h-72 md:w-40 lg:h-80 lg:w-44">
          <Image
            src={`${CONSTELLATION}/產品內容物/星座系列電動刮鬍刀禮盒-風象星座-02.png`}
            alt="昔馬星座系列電動刮鬍刀 風象星座"
            fill
            sizes="(max-width: 768px) 120px, 180px"
            className="object-contain object-bottom drop-shadow-2xl"
          />
        </div>
        <div className="relative h-40 w-48 sm:h-48 sm:w-56 md:h-60 md:w-72 lg:h-72 lg:w-80">
          <Image
            src={`${CONSTELLATION}/產品內容物/星座系列電動刮鬍刀禮盒.png`}
            alt="昔馬星座系列電動刮鬍刀禮盒 四象全系列"
            fill
            sizes="(max-width: 768px) 200px, 320px"
            className="object-contain object-bottom drop-shadow-2xl"
          />
        </div>
      </div>

      <div className="reveal-line flex flex-col items-center text-center md:items-end md:text-right">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-white/75 sm:text-xs">
          SMASMALL 昔馬
        </p>
        <h2 className="mb-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
          為俐落而生
        </h2>
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200 sm:text-base">
          Born To Be Sharp
        </p>
        <ul className="space-y-2.5 text-sm font-light text-white/90 sm:text-base">
          {features.map((item) => (
            <li
              key={item}
              className="reveal-line flex items-center gap-2 md:justify-end"
            >
              <span className="text-amber-200/90" aria-hidden>
                ◆
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const TEXT_SCROLL_SLIDES = [
  SlideDiscover,
  SlideFourElements,
  SlideBornSharp,
];

export const TEXT_SCROLL_SLIDE_COUNT = TEXT_SCROLL_SLIDES.length;

export function revealTextScrollSlide(slideRefs, index) {
  slideRefs.current.forEach((slideEl, i) => {
    if (!slideEl) return;

    if (i !== index) {
      gsap.set(slideEl, { autoAlpha: 0, pointerEvents: "none" });
      return;
    }

    gsap.set(slideEl, { autoAlpha: 1, pointerEvents: "auto" });
    const lines = slideEl.querySelectorAll(".reveal-line");

    gsap.set(lines, { y: 36, opacity: 0, filter: "blur(10px)" });
    gsap.to(lines, {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.75,
      stagger: 0.09,
      ease: "power3.out",
    });
  });
}
